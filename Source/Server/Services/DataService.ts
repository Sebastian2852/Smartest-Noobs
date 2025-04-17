import { OnStart, Service } from "@flamework/core";
import ProfileStore from "@rbxts/profile-store";
import { Players } from "@rbxts/services";
import { Events } from "Server/Network";
import { Logger } from "Shared/Modules/Logger";
import { PlayerDataTemplate } from "Shared/Modules/Types";

const PLAYER_PROFILE_STORE = ProfileStore.New("PlayerData", PlayerDataTemplate);

const UPDATE_DATA_EVENT = Events.Data.UpdateData;

@Service()
export default class DataService implements OnStart {
	private ProfileMap = new Map<number, ProfileStore.Profile<typeof PlayerDataTemplate>>();

	private UpdateLeaderstats(player: Player) {
		Logger.Trace("Updating player's leaderstats");
		const profile = this.ProfileMap.get(player.UserId);
		if (profile === undefined) {
			Logger.Warn("Cannot update leaderstats; no profile found");
			return;
		}

		const data = profile.Data;
		Logger.Trace("Got profile data");

		Logger.Trace("Looking for leaderstats folder");
		const leaderstatsFolder = player.WaitForChild("leaderstats") as Folder;

		Logger.Trace("Looking for wins value");
		const winsValue = leaderstatsFolder.WaitForChild("Wins") as IntValue;
		winsValue.Value = data.Wins;
		Logger.Trace("Updated wins value");

		Logger.Debug(`Updated ${player.Name}'s leaderstats`);
	}

	private CreateLeaderstatsFolder(player: Player) {
		Logger.Trace("Creating leaderstats folder for player");
		const leaderstatsFolder = new Instance("Folder");
		leaderstatsFolder.Name = "leaderstats";
		leaderstatsFolder.Parent = player;

		Logger.Trace("Creating leaderstats values");
		const winsValue = new Instance("IntValue");
		winsValue.Name = "Wins";
		winsValue.Parent = leaderstatsFolder;
		winsValue.Value = -1;
		Logger.Trace("Created wis value");

		Logger.Debug(`Created ${player.Name}'s leaderstats folder`);
	}

	private LoadProfileForPlayer(player: Player) {
		Logger.Trace("Loading data profile");
		const userId = player.UserId;
		const key = tostring(userId);
		const profile = PLAYER_PROFILE_STORE.StartSessionAsync(key, {
			Cancel: () => {
				return player.Parent !== Players;
			},
		});

		Logger.Trace("Checking profile is valid");
		if (profile === undefined) {
			Logger.Warn("Failed to load player data");
			player.Kick("Failed to load data - Please rejoin");
			return;
		}

		if (player.Parent !== Players) {
			Logger.Trace("Player left before profile was added to map; ending session");
			profile.EndSession();
		}

		Logger.Trace("Profile valid");
		profile.AddUserId(userId);
		profile.Reconcile();
		Logger.Trace("Reconciled profile's data");
		this.ProfileMap.set(userId, profile);
		Logger.Trace("Added profile to map");

		profile.OnSessionEnd.Connect(() => {
			this.ProfileMap.delete(userId);
			Logger.Debug("Session ended; removing profile from map");
		});

		UPDATE_DATA_EVENT.fire(player, profile.Data);
		Logger.Trace("Sent data update evnt");
		player.SetAttribute("DataLoaded", true);
		Logger.Trace("Marked player as DataLoaded");

		Logger.Debug(`Loaded ${player.Name}'s data`);
	}

	private OnPlayerAdded(player: Player) {
		player.SetAttribute("DataLoaded", false);
		this.CreateLeaderstatsFolder(player);
		this.LoadProfileForPlayer(player);
		this.UpdateLeaderstats(player);
	}

	private OnPlayerRemoved(player: Player) {
		const profile = this.ProfileMap.get(player.UserId);
		profile?.EndSession();
		Logger.Debug(`${player.Name} left, ended profile session`);
	}

	onStart() {
		Players.PlayerAdded.Connect((player) => this.OnPlayerAdded(player));
		Players.PlayerRemoving.Connect((player) => this.OnPlayerRemoved(player));
		Logger.Trace("Connected events");
	}
}

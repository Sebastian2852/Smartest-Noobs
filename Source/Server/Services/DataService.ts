import { OnStart, Service } from "@flamework/core";
import ProfileStore from "@rbxts/profile-store";
import { Players } from "@rbxts/services";
import { Events } from "Server/Network";
import { PlayerDataTemplate } from "Shared/Modules/Types";

const PLAYER_PROFILE_STORE = ProfileStore.New("PlayerData", PlayerDataTemplate);

const UPDATE_DATA_EVENT = Events.Data.UpdateData;

@Service()
export default class DataService implements OnStart {
	private ProfileMap = new Map<number, ProfileStore.Profile<typeof PlayerDataTemplate>>();

	private UpdateLeaderstats(player: Player) {
		const profile = this.ProfileMap.get(player.UserId);
		if (profile === undefined) {
			warn("Cannot update leaderstats; no profile found");
			return;
		}

		const data = profile.Data;

		const leaderstatsFolder = player.WaitForChild("leaderstats") as Folder;
		const winsValue = leaderstatsFolder.WaitForChild("Wins") as IntValue;
		winsValue.Value = data.Wins;
	}

	private CreateLeaderstatsFolder(player: Player) {
		const leaderstatsFolder = new Instance("Folder");
		leaderstatsFolder.Name = "leaderstats";
		leaderstatsFolder.Parent = player;

		const winsValue = new Instance("IntValue");
		winsValue.Name = "Wins";
		winsValue.Parent = leaderstatsFolder;
		winsValue.Value = -1;
	}

	private LoadProfileForPlayer(player: Player) {
		const userId = player.UserId;
		const key = tostring(userId);
		const profile = PLAYER_PROFILE_STORE.StartSessionAsync(key, {
			Cancel: () => {
				return player.Parent !== Players;
			},
		});

		if (profile === undefined) {
			warn("Failed to load player data");
			player.Kick("Failed to load data - Please rejoin");
			return;
		}

		if (player.Parent !== Players) {
			profile.EndSession();
		}

		profile.AddUserId(userId);
		profile.Reconcile();
		this.ProfileMap.set(userId, profile);

		profile.OnSessionEnd.Connect(() => {
			this.ProfileMap.delete(userId);
		});

		UPDATE_DATA_EVENT.fire(player, profile.Data);
		player.SetAttribute("DataLoaded", true);
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
	}

	onStart() {
		Players.PlayerAdded.Connect((player) => this.OnPlayerAdded(player));
		Players.PlayerRemoving.Connect((player) => this.OnPlayerRemoved(player));
	}
}

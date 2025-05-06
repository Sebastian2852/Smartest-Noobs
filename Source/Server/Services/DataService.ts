import { OnStart, Service } from "@flamework/core";
import ProfileStore from "@rbxts/profile-store";
import { Players, ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import { Events, Functions } from "Server/Network";
import { PlayerDataTemplate } from "Shared/Modules/Types";

const PLAYER_PROFILE_STORE = ProfileStore.New("PlayerData", PlayerDataTemplate);

const UPDATE_DATA_EVENT = Events.Data.UpdateData;
const EQUIP_STAND_FUNCTION = Functions.Data.EquipStand;

@Service()
export default class DataService implements OnStart {
	private ProfileMap = new Map<number, ProfileStore.Profile<typeof PlayerDataTemplate>>();

	public GiveWinToPlayer(player: Player) {
		const profile = this.ProfileMap.get(player.UserId);
		if (profile === undefined) {
			return undefined;
		}

		profile.Data.Wins += 1;
		UPDATE_DATA_EVENT.fire(player, profile.Data);
		this.UpdateLeaderstats(player);
	}

	public GetEquippedStandName(player: Player) {
		const profile = this.ProfileMap.get(player.UserId);
		if (profile === undefined) {
			return undefined;
		}

		return profile.Data.EquippedStand;
	}

	public GiveCoins(player: Player, amount: number) {
		const profile = this.ProfileMap.get(player.UserId);
		if (profile === undefined) {
			return;
		}

		profile.Data.Coins += amount;
		UPDATE_DATA_EVENT.fire(player, profile.Data);
	}

	private SetEquippedStand(player: Player, stand: string) {
		const profile = this.ProfileMap.get(player.UserId);
		if (profile === undefined) {
			return false;
		}

		profile.Data.EquippedStand = stand;
		UPDATE_DATA_EVENT.fire(player, profile.Data);
		return true;
	}

	private UpdateLeaderstats(player: Player) {
		const profile = this.ProfileMap.get(player.UserId);
		if (profile === undefined) return;

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
			player.Kick("Failed to load data - Please rejoin");
			return;
		}

		if (player.Parent !== Players) {
			profile.EndSession();
		}

		profile.AddUserId(userId);
		profile.Reconcile();

		ReplicatedStorage.Stands.GetChildren().forEach((standConfig) => {
			const foundData = profile.Data.Stands.get(standConfig.Name);
			if (foundData === undefined) {
				profile.Data.Stands.set(
					standConfig.Name,
					(standConfig.GetAttribute("OwnedByDefault") as boolean | undefined) ?? false,
				);
			}
		});

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

		ServerScriptService.Game.Cmdr.RunEvents.SetStand.Event.Connect((player: Player, stand: string) =>
			this.SetEquippedStand(player, stand),
		);

		EQUIP_STAND_FUNCTION.setCallback((player, stand) => this.SetEquippedStand(player, stand));
	}
}

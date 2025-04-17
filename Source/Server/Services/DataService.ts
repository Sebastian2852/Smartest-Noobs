import { OnStart, Service } from "@flamework/core";
import ProfileStore from "@rbxts/profile-store";
import { Players } from "@rbxts/services";
import { PlayerDataTemplate } from "Shared/Modules/Types";

const PLAYER_PROFILE_STORE = ProfileStore.New("PlayerData", PlayerDataTemplate);

@Service()
export default class DataService implements OnStart {
	private ProfileMap = new Map<number, ProfileStore.Profile<typeof PlayerDataTemplate>>();

	private OnPlayerAdded(player: Player) {
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

		player.SetAttribute("DataLoaded", true);
	}

	private OnPlayerRemoved(player: Player) {
		const profile = this.ProfileMap.get(player.UserId);
		profile?.EndSession();
	}

	onStart() {
		Players.PlayerAdded.Connect((player) => {
			player.SetAttribute("DataLoaded", false);
			this.OnPlayerAdded(player);
		});

		Players.PlayerRemoving.Connect((player) => this.OnPlayerRemoved(player));
	}
}

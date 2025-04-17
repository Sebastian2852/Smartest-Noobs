import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { GetConfig } from "Shared/Modules/Utils";
import StatusService from "./StatusService";

const SERVER_CONFIG = GetConfig();
const PLAYERS_NEEDED_TO_START_GAME = SERVER_CONFIG.GameLoop.PlayersNeededToStart;

@Service()
export default class GameLoopService implements OnStart {
	private ServerClosing = false;

	private IsPlayerReady(player: Player) {
		const dataLoaded = (player.GetAttribute("DataLoaded") as boolean) ?? false;
		return dataLoaded;
	}

	private GetPlayerCount() {
		let players = 0;

		Players.GetPlayers().forEach((player) => {
			if (!this.IsPlayerReady(player)) return;
			players += 1;
		});

		return players;
	}

	onStart() {
		game.BindToClose(() => {
			this.ServerClosing = true;
		});

		while (!this.ServerClosing) {
			let playersInGame = this.GetPlayerCount();

			// Make sure there are enough players
			if (playersInGame < PLAYERS_NEEDED_TO_START_GAME) {
				this.StatusService.UpdateStatus("Not enough players");
				task.wait(1);
				continue;
			}

			this.StatusService.UpdateStatus("Intermission");
			this.StatusService.StartCountdown(10);
			task.wait(10);

			playersInGame = this.GetPlayerCount();

			if (playersInGame < PLAYERS_NEEDED_TO_START_GAME) {
				this.StatusService.UpdateStatus("Not enough players");
				continue;
			}
		}
	}

	constructor(private StatusService: StatusService) {}
}

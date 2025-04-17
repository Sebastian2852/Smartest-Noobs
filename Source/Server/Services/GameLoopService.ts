import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { GetConfig } from "Shared/Modules/Utils";
import StatusService from "./StatusService";
import { Logger } from "Shared/Modules/Logger";

const SERVER_CONFIG = GetConfig();
const PLAYERS_NEEDED_TO_START_GAME = SERVER_CONFIG.GameLoop.PlayersNeededToStart;
const INTERMISSION_LENGTH = SERVER_CONFIG.GameLoop.IntermissionTime;

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
		Logger.Trace("Starting game loop");
		game.BindToClose(() => {
			Logger.Debug("Server closing, disabling game loop");
			this.ServerClosing = true;
		});

		Logger.Debug("Starting game loop");
		while (!this.ServerClosing) {
			let playersInGame = this.GetPlayerCount();

			// Make sure there are enough players
			if (playersInGame < PLAYERS_NEEDED_TO_START_GAME) {
				this.StatusService.UpdateStatus("Not enough players");
				task.wait(1);
				continue;
			}

			Logger.Trace("Starting intermission");
			this.StatusService.UpdateStatus("Intermission");
			this.StatusService.StartCountdown(INTERMISSION_LENGTH);
			task.wait(INTERMISSION_LENGTH);

			Logger.Trace("Checking if there are still enough players in the game");
			playersInGame = this.GetPlayerCount();

			if (playersInGame < PLAYERS_NEEDED_TO_START_GAME) {
				this.StatusService.UpdateStatus("Not enough players");
				Logger.Trace("A player(s) left; restarting loop");
				continue;
			}
		}
	}

	constructor(private StatusService: StatusService) {}
}

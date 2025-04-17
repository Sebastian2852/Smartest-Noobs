import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { GetConfig } from "Shared/Modules/Utils";
import StatusService from "./StatusService";

const SERVER_CONFIG = GetConfig();

@Service()
export default class GameLoopService implements OnStart {
	private ServerClosing = false;

	onStart() {
		game.BindToClose(() => {
			this.ServerClosing = true;
		});

		while (!this.ServerClosing) {
			const playersInGame = Players.GetChildren().size();
			const playersNeeded = SERVER_CONFIG.GameLoop.PlayersNeededToStart;

			// Make sure there are enough players
			if (playersInGame < playersNeeded) {
				print("Not enough players");
				this.StatusService.UpdateStatus("Not enough players");
				task.wait(1);
				continue;
			}

			this.StatusService.UpdateStatus("Running loop");
			print("Running loop");
			task.wait(1);
		}
	}

	constructor(private StatusService: StatusService) {}
}

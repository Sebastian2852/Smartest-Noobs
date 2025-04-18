import { Controller, OnStart } from "@flamework/core";
import ClientDataController from "./ClientDataController";
import { Players } from "@rbxts/services";
import { PlayerDataTemplate } from "Shared/Modules/Types";
import { Logger } from "Shared/Modules/Logger";

const PLAYER = Players.LocalPlayer;

@Controller()
export default class UserInterfaceController implements OnStart {
	private UpdateWinsStat(wins: number) {
		const winsString = tostring(wins);
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const winsLabel = playerGui.ScreenGui.Stats.Wins.Wins.Text;

		winsLabel.Text = winsString;
		Logger.Debug("Updated wins text label");
	}

	private OnDataChanged(data: typeof PlayerDataTemplate) {
		Logger.Trace("Data changed");
		this.UpdateWinsStat(data.Wins);
	}

	onStart() {
		this.ClientDataController.DataChanged.Connect((data) => this.OnDataChanged(data));
	}

	constructor(private ClientDataController: ClientDataController) {}
}

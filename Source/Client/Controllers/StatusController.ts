import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "Client/Network";

const UPDATE_STATUS_EVENT = Events.UpdateStatus;
const PLAYER = Players.LocalPlayer;

@Controller()
export default class StatusController implements OnStart {
	private UpdateStatusGui(newStatusText: string) {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const statusTextLabel = playerGui.ScreenGui.TopBar.TopBar.Text;

		statusTextLabel.Text = newStatusText;
	}

	onStart() {
		UPDATE_STATUS_EVENT.connect((newStatus) => this.UpdateStatusGui(newStatus));
	}
}

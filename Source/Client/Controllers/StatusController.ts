import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events, Functions } from "Client/Network";
import { Logger } from "Shared/Modules/Logger";

const UPDATE_STATUS_EVENT = Events.UpdateStatus;
const GET_STATUS_FUNCTION = Functions.GetCurrentStatus;

const START_TIMER_EVENT = Events.StartTimer;

const PLAYER = Players.LocalPlayer;

@Controller()
export default class StatusController implements OnStart {
	private UpdateStatusGui(newStatusText: string) {
		Logger.Trace("Updating status GUI");
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const statusTextLabel = playerGui.ScreenGui.TopBar.TopBar.Text;

		statusTextLabel.Text = newStatusText;
		Logger.Debug("Updated status label text to status: " + newStatusText);
	}

	private UpdateCountdownGui(time: number) {
		Logger.Trace("Updating time text label");
		const asString = tostring(time);
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const countdownLabel = playerGui.ScreenGui.TopBar.TopBar.WinsBackground.Text;

		countdownLabel.Text = asString;
		Logger.Debug("Updated countdown GUI");
	}

	private StartCountdown(length: number) {
		Logger.Debug("Starting countdown loop that lasts: " + tostring(length) + "s");
		for (let i = 0; i <= length; i++) {
			this.UpdateCountdownGui(length - i);
			task.wait(1);
		}
	}

	onStart() {
		UPDATE_STATUS_EVENT.connect((newStatus) => this.UpdateStatusGui(newStatus));
		GET_STATUS_FUNCTION.invoke().andThen((status) => this.UpdateStatusGui(status));

		START_TIMER_EVENT.connect((timerLength: number) => this.StartCountdown(timerLength));
		Logger.Trace("Connected evetns");
	}
}

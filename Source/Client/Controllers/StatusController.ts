import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events, Functions } from "Client/Network";

const UPDATE_STATUS_EVENT = Events.UpdateStatus;
const GET_STATUS_FUNCTION = Functions.GetCurrentStatus;

const START_TIMER_EVENT = Events.StartTimer;
const STOP_TIMER_EVENT = Events.StopTimer;

const PLAYER = Players.LocalPlayer;

@Controller()
export default class StatusController implements OnStart {
	private StopTimer = false;

	private UpdateStatusGui(newStatusText: string) {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const statusTextLabel = playerGui.ScreenGui.TopBar.TopBar.Text;

		statusTextLabel.Text = newStatusText;
	}

	private UpdateCountdownGui(time: number) {
		const asString = tostring(time);
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const frame = playerGui.ScreenGui.TopBar.TopBar.WinsBackground;
		const countdownLabel = frame.Text;

		frame.Visible = true;
		countdownLabel.Text = asString;
	}

	private StartCountdown(length: number) {
		for (let i = 0; i <= length; i++) {
			this.UpdateCountdownGui(length - i);
			task.wait(1);

			if (this.StopTimer) break;
		}

		this.StopTimer = false;
	}

	private StopCountdown() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const countdownLabel = playerGui.ScreenGui.TopBar.TopBar.WinsBackground;
		countdownLabel.Visible = false;
		this.StopTimer = true;
	}

	public HideStatusGui() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.ScreenGui.TopBar.Visible = false;
	}

	public ShowStatusGui() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.ScreenGui.TopBar.Visible = true;
	}

	onStart() {
		UPDATE_STATUS_EVENT.connect((newStatus) => this.UpdateStatusGui(newStatus));
		GET_STATUS_FUNCTION.invoke().andThen((status) => this.UpdateStatusGui(status));

		START_TIMER_EVENT.connect((timerLength: number) => this.StartCountdown(timerLength));
		STOP_TIMER_EVENT.connect(() => this.StopCountdown());

		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.WaitForChild("ScreenGui");
		const countdownLabel = playerGui.ScreenGui.TopBar.TopBar.WinsBackground;
		countdownLabel.Visible = false;
	}
}

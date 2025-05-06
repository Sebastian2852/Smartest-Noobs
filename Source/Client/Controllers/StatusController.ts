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

	private FormatTime(seconds: number): string {
		const minutes = math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${string.format("%02d", minutes)} : ${string.format("%02d", secs)}`;
	}

	private UpdateStatusGui(newStatusText: string) {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const statusTextLabel = playerGui.ScreenGui.Timer.TimerMessage;

		statusTextLabel.Text = newStatusText;
	}

	private UpdateCountdownGui(time: number) {
		const asString = this.FormatTime(time);
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const frame = playerGui.ScreenGui.Timer;
		const countdownLabel = frame.CountDown;

		countdownLabel.Text = asString;
	}

	private StartCountdown(length: number) {
		for (let i = 0; i <= length; i++) {
			this.UpdateCountdownGui(length - i);
			task.wait(1);

			if (this.StopTimer) break;
		}

		if (this.StopTimer) {
			const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
			const countdownLabel = playerGui.ScreenGui.Timer.CountDown;
			countdownLabel.Text = "00 : 00";
		}

		this.StopTimer = false;
	}

	private StopCountdown() {
		this.StopTimer = true;
	}

	public HideStatusGui() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.ScreenGui.Timer.TimerMessage.Text = "";
	}

	public ShowStatusGui() {
		// const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		// playerGui.ScreenGui.Timer.Visible = true;
	}

	onStart() {
		UPDATE_STATUS_EVENT.connect((newStatus) => this.UpdateStatusGui(newStatus));
		GET_STATUS_FUNCTION.invoke().andThen((status) => this.UpdateStatusGui(status));

		START_TIMER_EVENT.connect((timerLength: number) => this.StartCountdown(timerLength));
		STOP_TIMER_EVENT.connect(() => this.StopCountdown());

		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.WaitForChild("ScreenGui");
		const countdownLabel = playerGui.ScreenGui.Timer.CountDown;
		countdownLabel.Text = "00 : 00";
	}
}

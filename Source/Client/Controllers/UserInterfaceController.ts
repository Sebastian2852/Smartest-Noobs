import { Controller, OnStart } from "@flamework/core";
import ClientDataController from "./ClientDataController";
import { Players, TweenService } from "@rbxts/services";
import { PlayerDataTemplate } from "Shared/Modules/Types";
import { Events } from "Client/Network";

const PLAYER = Players.LocalPlayer;

const QUESTION_EVENT = Events.Question;
const HIDE_QUESTION_EVENT = Events.HideQuestion;
const ANSWER_QUESTION_EVENT = Events.AnswerQuestion;

@Controller()
export default class UserInterfaceController implements OnStart {
	private UpdateWinsStat(wins: number) {
		const winsString = tostring(wins);
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const winsLabel = playerGui.ScreenGui.Stats.Wins.Wins.Text;

		winsLabel.Text = winsString;
	}

	private UpdateCoinsStat(coins: number) {
		const coinsString = tostring(coins);
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const coinsLabel = playerGui.ScreenGui.Stats.Coins.Coins.Text;
		coinsLabel.Text = coinsString;
	}

	private UpdateQuestion(questionText: string) {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const questionGUI = playerGui.ScreenGui.QuestionBar;
		const questionLabel = questionGUI.QuestionText;

		questionGUI.Visible = true;
		questionLabel.Text = questionText;
	}

	private SubmitAnswer() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const questionGUI = playerGui.ScreenGui.QuestionBar;
		const answer = questionGUI.InputArea.InputBox.Text;
		ANSWER_QUESTION_EVENT.fire(answer);
		questionGUI.Visible = false;
		questionGUI.InputArea.InputBox.Text = "";
	}

	private OnDataChanged(data: typeof PlayerDataTemplate) {
		this.UpdateWinsStat(data.Wins);
		this.UpdateCoinsStat(data.Coins);
	}

	public ShowGameGui() {}

	public HideGameGui() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.ScreenGui.Buttons.Visible = false;
		playerGui.ScreenGui.Stats.Visible = false;
		playerGui.ScreenGui.Crates.Visible = false;
		playerGui.ScreenGui.Stands.Visible = false;
	}

	public StartTransition() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const transitionFrame = playerGui.FullScreen.Transition;

		const tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 0);
		TweenService.Create(transitionFrame, tweenInfo, {
			BackgroundTransparency: 0,
		}).Play();
	}

	public EndTransition() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const transitionFrame = playerGui.FullScreen.Transition;

		const tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 0);
		TweenService.Create(transitionFrame, tweenInfo, {
			BackgroundTransparency: 1,
		}).Play();
	}

	onStart() {
		this.ClientDataController.DataChanged.Connect((data) => this.OnDataChanged(data));

		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.WaitForChild("ScreenGui"); // Ensure GUI exists before doing anything else
		const questionGUI = playerGui.ScreenGui.QuestionBar;

		QUESTION_EVENT.connect((questionText) => this.UpdateQuestion(questionText));
		HIDE_QUESTION_EVENT.connect(() => (questionGUI.Visible = false));

		questionGUI.InputArea.SubmitButton.MouseButton1Click.Connect(() => this.SubmitAnswer());

		questionGUI.InputArea.InputBox.FocusLost.Connect((enterPressed) => {
			if (!enterPressed) return;
			this.SubmitAnswer();
		});
	}

	constructor(private ClientDataController: ClientDataController) {}
}

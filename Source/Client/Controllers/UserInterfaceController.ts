import { Controller, OnStart } from "@flamework/core";
import ClientDataController from "./ClientDataController";
import { Players } from "@rbxts/services";
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
	}

	onStart() {
		this.ClientDataController.DataChanged.Connect((data) => this.OnDataChanged(data));

		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
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

import { Controller, OnStart } from "@flamework/core";
import ClientDataController from "./ClientDataController";
import { Players } from "@rbxts/services";
import { PlayerDataTemplate } from "Shared/Modules/Types";
import { Logger } from "Shared/Modules/Logger";
import { Events } from "Client/Network";

const PLAYER = Players.LocalPlayer;

const QUESTION_EVENT = Events.Question;
const ANSWER_QUESTION_EVENT = Events.AnswerQuestion;

@Controller()
export default class UserInterfaceController implements OnStart {
	private UpdateWinsStat(wins: number) {
		const winsString = tostring(wins);
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const winsLabel = playerGui.ScreenGui.Stats.Wins.Wins.Text;

		winsLabel.Text = winsString;
		Logger.Debug("Updated wins text label");
	}

	private UpdateQuestion(questionText: string) {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const questionGUI = playerGui.ScreenGui.QuestionBar;
		const questionLabel = questionGUI.QuestionText;

		questionGUI.Visible = true;
		questionLabel.Text = questionText;
		Logger.Debug("Updated question text");
	}

	private HideQuestiongGUI() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const questionGUI = playerGui.ScreenGui.QuestionBar;
		questionGUI.Visible = false;
		Logger.Debug("Hidden question GUI");
	}

	private OnDataChanged(data: typeof PlayerDataTemplate) {
		Logger.Trace("Data changed");
		this.UpdateWinsStat(data.Wins);
	}

	onStart() {
		this.ClientDataController.DataChanged.Connect((data) => this.OnDataChanged(data));

		QUESTION_EVENT.connect((questionText, QuestionTime) => this.UpdateQuestion(questionText));

		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		const questionGUI = playerGui.ScreenGui.QuestionBar;

		questionGUI.InputArea.SubmitButton.MouseButton1Click.Connect(() => {
			const answer = questionGUI.InputArea.InputBox.Text;
			ANSWER_QUESTION_EVENT.fire(answer);
		});

		questionGUI.InputArea.InputBox.FocusLost.Connect((enterPressed) => {
			if (!enterPressed) return;
			const answer = questionGUI.InputArea.InputBox.Text;
			ANSWER_QUESTION_EVENT.fire(answer);
		});
	}

	constructor(private ClientDataController: ClientDataController) {}
}

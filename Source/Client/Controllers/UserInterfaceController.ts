import { Controller, OnStart } from "@flamework/core";
import ClientDataController from "./ClientDataController";
import { Players, ReplicatedStorage, TweenService } from "@rbxts/services";
import { PlayerDataTemplate } from "Shared/Modules/Types";
import { Events, Functions } from "Client/Network";
import { Trove } from "@rbxts/trove";

const PLAYER = Players.LocalPlayer;

const QUESTION_EVENT = Events.Question;
const HIDE_QUESTION_EVENT = Events.HideQuestion;
const ANSWER_QUESTION_EVENT = Events.AnswerQuestion;
const SHOW_GAME_GUI_EVENT = Events.ShowGameGui;

const EQUIP_STAND_FUNCTION = Functions.Data.EquipStand;

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

	public ShowGameGui() {
		const playerGui = PLAYER.WaitForChild("PlayerGui") as PlayerGui;
		playerGui.ScreenGui.Buttons.Visible = true;
		playerGui.ScreenGui.Stats.Visible = true;
	}

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
		SHOW_GAME_GUI_EVENT.connect(() => this.ShowGameGui());

		// Connect GUI events

		questionGUI.InputArea.SubmitButton.MouseButton1Click.Connect(() => this.SubmitAnswer());

		questionGUI.InputArea.InputBox.FocusLost.Connect((enterPressed) => {
			if (!enterPressed) return;
			this.SubmitAnswer();
		});

		playerGui.ScreenGui.Buttons.Crates.MouseButton1Click.Connect(() => {
			playerGui.ScreenGui.Crates.Visible = !playerGui.ScreenGui.Crates.Visible;
		});

		playerGui.ScreenGui.Buttons.Stands.MouseButton1Click.Connect(() => {
			playerGui.ScreenGui.Stands.Visible = !playerGui.ScreenGui.Stands.Visible;
		});

		playerGui.ScreenGui.Crates.CloseButton.MouseButton1Click.Connect(() => {
			playerGui.ScreenGui.Crates.Visible = false;
		});

		playerGui.ScreenGui.Stands.BackGround.CloseButton.MouseButton1Click.Connect(() => {
			playerGui.ScreenGui.Stands.Visible = false;
		});

		// Create GUIs

		const standsShop = playerGui.ScreenGui.Stands;
		const items = standsShop.Stands.Items;
		const standTemplate = items.UIListLayout.Template;

		const standsTrove = new Trove();

		function UpdateStandsButtons(data: typeof PlayerDataTemplate) {
			standsTrove.clean();
			data.Stands.forEach((owned, name) => {
				const button = items.FindFirstChild(name);
				assert(button, "No button was ever created for " + name);

				const notOwnedOverlay = button.FindFirstChild("NotOwned")! as ImageLabel;
				const equipButton = button.FindFirstChild("Equip")! as TextButton;
				const equipButtonText = equipButton.FindFirstChild("text")! as TextLabel;
				notOwnedOverlay.Visible = !owned;

				if (owned) {
					if (name === data.EquippedStand) {
						equipButtonText.Text = "Equipped";
						equipButton.Interactable = false;
					} else {
						equipButtonText.Text = "Equip";
						equipButton.Interactable = true;
					}

					standsTrove.add(
						equipButton.MouseButton1Click.Connect(() => {
							EQUIP_STAND_FUNCTION.invoke(button.Name).andThen((didEquip) => {
								// The server did not allow us to equip this stand
								// we can assume the player doesnt actually own this stand
								if (!didEquip) notOwnedOverlay.Visible = true;
							});
						}),
					);
				} else {
					equipButtonText.Text = "Locked";
					equipButton.Interactable = false;
				}
			});
		}

		ReplicatedStorage.Stands.GetChildren().forEach((standConfig) => {
			const newButton = standTemplate.Clone();
			newButton.SwordName.Text = (standConfig.GetAttribute("DisplayName") as string | undefined) ?? "[UNKOWN]";
			newButton.ItemImage.Image = (standConfig.GetAttribute("Icon") as string | undefined) ?? "";
			newButton.Parent = items;
			newButton.Name = standConfig.Name;
		});

		this.ClientDataController.DataChanged.Connect((data) => UpdateStandsButtons(data));
		const data = this.ClientDataController.GetData();
		UpdateStandsButtons(data);
	}

	constructor(private ClientDataController: ClientDataController) {}
}

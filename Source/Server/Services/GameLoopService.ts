import { OnStart, Service } from "@flamework/core";
import { Players, ReplicatedStorage, StarterGui, TweenService, Workspace } from "@rbxts/services";
import { GetConfig } from "Shared/Modules/Utils";
import StatusService from "./StatusService";
import DataService from "./DataService";
import { Trove } from "@rbxts/trove";
import { Events } from "Server/Network";
import { Cutscenes } from "Shared/Modules/Types";
import { GetQuestionsData } from "Server/Modules/Util";

const SERVER_CONFIG = GetConfig();
const QUESTION_DATA = GetQuestionsData();

const PLAYERS_NEEDED_TO_START_GAME = SERVER_CONFIG.GameLoop.PlayersNeededToStart;
const INTERMISSION_LENGTH = SERVER_CONFIG.GameLoop.IntermissionTime;

const START_CUTSCENE_EVENT = Events.StartCutscene;
const QUESTION_EVENT = Events.Question;
const HIDE_QUESTION_EVENT = Events.HideQuestion;
const ANSWER_QUESTION_EVENT = Events.AnswerQuestion;
const UPDATE_ACTIVE_PLAYER_EVENT = Events.UpdateActivePlayer;
const SHOW_GAME_GUI_EVENT = Events.ShowGameGui;

const CURTAIN = Workspace.GameParts.Curtain;
const LOBBY_LIGHTS = Workspace.LobbyLights;
const ORIGINAL_CURTAIN_CFRAME = CURTAIN.CFrame;

@Service()
export default class GameLoopService implements OnStart {
	private ServerClosing = false;
	// UserID, StandIndex
	private StandMap = new Map<number, number>();

	private IsPlayerReady(player: Player) {
		const dataLoaded = (player.GetAttribute("DataLoaded") as boolean) ?? false;
		return dataLoaded;
	}

	private GetPlayersReady() {
		const players: Player[] = [];

		Players.GetPlayers().forEach((player) => {
			if (!this.IsPlayerReady(player)) return;
			players.insert(players.size(), player);
		});

		return players;
	}

	private GetPlayerCount() {
		return this.GetPlayersReady().size();
	}

	private GiveStand(player: Player, index: number): LuaTuple<[Model, () => void]> {
		const equippedStand = this.DataService.GetEquippedStandName(player) ?? "Default";
		const standConfig = ReplicatedStorage.Stands.FindFirstChild(equippedStand)!;
		const standModel = standConfig.FindFirstChildWhichIsA("Model")!;

		// Podiums start at 1 instead of 0
		const podiumIndex = index + 1;
		const podium = Workspace.Podiums.FindFirstChild(tostring(podiumIndex)) as Model;

		if (podium === undefined) {
			player.Kick("Too many players in server?");
			return $tuple(undefined as unknown as Model, undefined as unknown as () => void);
		}

		const pivot = podium.GetPivot();
		const newPivot = pivot.add(new Vector3(0, -50, 0));

		podium.PivotTo(newPivot);

		const playerStand = standModel.Clone();
		playerStand.Parent = Workspace;
		playerStand.PivotTo(pivot);

		this.StandMap.set(player.UserId, index + 1);
		return $tuple(playerStand, () => podium.PivotTo(pivot));
	}

	private RemoveStand(player: Player) {
		const standId = this.StandMap.get(player.UserId);
		if (standId === undefined) return false;

		const stand = Workspace.Podiums.FindFirstChild(tostring(standId));
		if (stand === undefined) return false;
		stand.Destroy();

		this.StandMap.delete(player.UserId);

		return true;
	}

	onStart() {
		game.BindToClose(() => {
			this.ServerClosing = true;
		});

		while (!this.ServerClosing) {
			const playersInGame = this.GetPlayerCount();

			// Make sure there are enough players
			if (playersInGame < PLAYERS_NEEDED_TO_START_GAME) {
				this.StatusService.UpdateStatus("Not enough players");
				task.wait(1);
				continue;
			}

			this.StatusService.UpdateStatus("Intermission");
			this.StatusService.StartCountdown(INTERMISSION_LENGTH);
			const playingPlayers = this.GetPlayersReady();
			const gameTrove = new Trove();
			task.wait(INTERMISSION_LENGTH);
			this.StatusService.CancelCountdown();
			this.StatusService.UpdateStatus("Preparing game");

			const rng = new Random(os.time());
			rng.Shuffle(playingPlayers);

			playingPlayers.forEach((player, index) => {
				const [stand, resetStandPos] = this.GiveStand(player, index);
				gameTrove.add(stand);
				gameTrove.add(resetStandPos);
			});

			START_CUTSCENE_EVENT.broadcast(Cutscenes.Start);

			task.wait(0.5);

			playingPlayers.forEach((player, index) => {
				if (!player.Character) {
					playingPlayers.remove(index);
					this.RemoveStand(player);
					return;
				}

				const standId = this.StandMap.get(player.UserId);

				if (standId === undefined) {
					playingPlayers.remove(index);
					this.RemoveStand(player);
					return;
				}

				const trapdoor = Workspace.TrapDoors.FindFirstChild(tostring(standId))! as BasePart;
				const character = player.Character;
				const Humanoid = character.FindFirstChildWhichIsA("Humanoid")!;

				gameTrove.add(
					Humanoid.Died.Connect(() => {
						playingPlayers.remove(index);
						this.RemoveStand(player);
					}),
				);

				gameTrove.add(
					character.Destroying.Connect(() => {
						playingPlayers.remove(index);
						this.RemoveStand(player);
					}),
				);

				Humanoid.WalkSpeed = 0;
				Humanoid.JumpHeight = 0;
				character.PivotTo(trapdoor.CFrame.add(new Vector3(0, 5, 0)));
			});

			task.wait(1.5);

			LOBBY_LIGHTS.GetDescendants().forEach((light) => {
				if (!light.IsA("Light")) return;

				const tweenInfo = new TweenInfo(1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
				TweenService.Create(light, tweenInfo, {
					Brightness: 0,
				}).Play();
			});

			task.wait(3);

			CURTAIN.CFrame = CURTAIN.CFrame.add(new Vector3(0, 25, 0));

			let currentGrade = 1;

			while (playingPlayers.size() > 0) {
				const currentGradeData = QUESTION_DATA.get(currentGrade);
				if (currentGradeData === undefined) {
					break;
				}

				const subjects = currentGradeData.Subjects;
				subjects.forEach((questions, subjectName) => {
					Workspace.GameParts.GradeLevel.board.SurfaceGui.GradeSubject.Text = `Grade ${currentGrade} - ${subjectName}`;

					playingPlayers.forEach((player, index) => {
						if (player === undefined) {
							playingPlayers.remove(index);
							return;
						}
						task.wait(1);

						UPDATE_ACTIVE_PLAYER_EVENT.broadcast(index + 1);

						task.wait(2);

						const randomIndex = rng.NextInteger(1, questions.size());
						const question = questions.get(randomIndex);
						assert(question, "no question?");
						QUESTION_EVENT.fire(player, question.Question, currentGradeData.QuestionTime);

						let questionAnswered = false;
						let answerCorrect = false;

						const answerConnection = ANSWER_QUESTION_EVENT.connect((player, answer) => {
							answerConnection.Disconnect();
							questionAnswered = true;
							let realAnswer: string | number = answer;

							if (!question.Answer.ExactString) {
								realAnswer = string.lower(answer);
							}

							if (question.Answer.AnswerType === "number") {
								realAnswer = tonumber(answer) ?? answer;
							}

							if (
								realAnswer === question.Answer.Answer &&
								type(realAnswer) === question.Answer.AnswerType
							) {
								answerCorrect = true;
							} else {
								player.LoadCharacter();
								SHOW_GAME_GUI_EVENT.fire(player);
							}
						});

						this.StatusService.UpdateStatus("TODO");
						this.StatusService.StartCountdown(currentGradeData.QuestionTime);

						for (let index = 1; index < currentGradeData.QuestionTime; index++) {
							if (questionAnswered) {
								break;
							}

							task.wait(1);
						}

						this.StatusService.CancelCountdown();
						HIDE_QUESTION_EVENT.fire(player);
						answerConnection.Disconnect();

						if (answerCorrect) {
							this.DataService.GiveCoins(player, question.Reward);
						} else {
							player.LoadCharacter();
							playingPlayers.remove(index);
						}
					});

					task.wait(2);
				});

				currentGrade++;
			}

			this.StatusService.UpdateStatus("Game over");
			START_CUTSCENE_EVENT.broadcast(Cutscenes.End);

			task.wait(5);

			CURTAIN.CFrame = ORIGINAL_CURTAIN_CFRAME;
			LOBBY_LIGHTS.GetDescendants().forEach((light) => {
				if (!light.IsA("Light")) return;

				const tweenInfo = new TweenInfo(1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
				TweenService.Create(light, tweenInfo, {
					Brightness: 1,
				}).Play();
			});

			playingPlayers.forEach((player) => player.LoadCharacter());
			SHOW_GAME_GUI_EVENT.broadcast();

			gameTrove.destroy();
		}
	}

	constructor(private StatusService: StatusService, private DataService: DataService) {}
}

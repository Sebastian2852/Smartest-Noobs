import { Controller, OnStart } from "@flamework/core";
import { Players, TweenService, Workspace } from "@rbxts/services";
import { Events } from "Client/Network";
import { Cutscenes } from "Shared/Modules/Types";
import UserInterfaceController from "./UserInterfaceController";
import StatusController from "./StatusController";

const PLAYER = Players.LocalPlayer;

const START_CUTSCENE_EVENT = Events.StartCutscene;
const UPDATE_ACTIVE_PLAYER_EVENT = Events.UpdateActivePlayer;

const CURTAIN = Workspace.GameParts.Curtain;
const PLAYER_SPOTLIGHT = Workspace.GameParts.PlayerSpotLight;

const ORIGINAL_CURTAIN_CFRAME = CURTAIN.CFrame;

@Controller()
export default class CutsceneController implements OnStart {
	private ActivePlayer = -1;

	private StartCutscene() {
		const camera = Workspace.CurrentCamera!;
		const cameraPositions = Workspace.StartCutsceneCameraPositions.GetChildren() as Part[];

		this.UserInterfaceController.StartTransition();

		camera.CameraType = Enum.CameraType.Scriptable;
		cameraPositions.sort((a, b) => {
			const aNumber = tonumber(a.Name)!;
			const bNumber = tonumber(b.Name)!;
			return aNumber < bNumber;
		});

		task.wait(0.5);
		this.UserInterfaceController.HideGameGui();
		this.StatusController.HideStatusGui();
		task.wait(0.5);

		this.UserInterfaceController.EndTransition();

		task.spawn(() => {
			task.wait(1);
			const tweenInfo = new TweenInfo(4, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
			const tween = TweenService.Create(CURTAIN, tweenInfo, {
				CFrame: CURTAIN.CFrame.add(new Vector3(0, 25, 0)),
			});
			tween.Play();
		});

		cameraPositions.forEach((PositionPart) => {
			if (tonumber(PositionPart.Name)! === 1) {
				camera.CFrame = PositionPart.CFrame;
				return;
			}

			const tweenInfo = new TweenInfo(5, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
			const tween = TweenService.Create(camera, tweenInfo, {
				CFrame: PositionPart.CFrame,
			});
			tween.Play();
			tween.Completed.Wait();
		});

		this.StatusController.ShowStatusGui();
	}

	private EndCutscene() {
		this.UserInterfaceController.StartTransition();

		const camera = Workspace.CurrentCamera!;
		const tweenInfo = new TweenInfo(4, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
		const tween = TweenService.Create(CURTAIN, tweenInfo, {
			CFrame: ORIGINAL_CURTAIN_CFRAME,
		});

		task.wait(1);

		this.UserInterfaceController.EndTransition();
		tween.Play();
		camera.CameraType = Enum.CameraType.Custom;

		const character = PLAYER.Character ?? PLAYER.CharacterAdded.Wait()[0];
		camera.CameraSubject = character.WaitForChild("Humanoid")! as Humanoid;
	}

	private DeathCutscene() {
		// const activePlayer = this.ActivePlayer;
		// const camera = Workspace.CurrentCamera!;
		// const floor = Workspace.TrapDoors.FindFirstChild(tostring(activePlayer)) as Part;
		// const targetPosition = floor.CFrame.mul(new CFrame(0, 7, 10)).mul(CFrame.Angles(0, 0, 0));

		// const tweenInfo = new TweenInfo(1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
		// TweenService.Create(camera, tweenInfo, {
		// 	CFrame: targetPosition,
		// }).Play();

		warn("no impl");
	}

	onStart() {
		START_CUTSCENE_EVENT.connect((cutscene) => {
			switch (cutscene) {
				case Cutscenes.Start:
					this.StartCutscene();
					break;
				case Cutscenes.End:
					this.EndCutscene();
					break;
				case Cutscenes.Death:
					this.DeathCutscene();
					break;
				default:
					warn("Invalid cutscene passed");
					break;
			}
		});

		UPDATE_ACTIVE_PLAYER_EVENT.connect((index) => {
			this.ActivePlayer = index;
			const camera = Workspace.CurrentCamera!;
			const floor = Workspace.TrapDoors.FindFirstChild(tostring(index)) as Part;

			const CameraPosition = floor.CFrame.mul(new CFrame(0, 7, -10)).mul(CFrame.Angles(0, math.rad(180), 0));

			const tweenInfo = new TweenInfo(1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
			TweenService.Create(camera, tweenInfo, {
				CFrame: CameraPosition,
			}).Play();

			const spotlightPos = PLAYER_SPOTLIGHT.CFrame;
			const floorPos = floor.CFrame.Position;

			TweenService.Create(PLAYER_SPOTLIGHT, tweenInfo, {
				Position: new Vector3(floorPos.X, spotlightPos.Y, spotlightPos.Z),
			}).Play();
		});
	}

	constructor(private UserInterfaceController: UserInterfaceController, private StatusController: StatusController) {}
}

import { Controller, OnStart } from "@flamework/core";
import { TweenService, Workspace } from "@rbxts/services";
import { Events } from "Client/Network";
import { Cutscenes } from "Shared/Modules/Types";

const START_CUTSCENE_EVENT = Events.StartCutscene;
const UPDATE_ACTIVE_PLAYER_EVENT = Events.UpdateActivePlayer;

const CURTAIN = Workspace.GameParts.Curtain;
const ORIGINAL_CURTAIN_CFRAME = CURTAIN.CFrame;

@Controller()
export default class CutsceneController implements OnStart {
	private StartCutscene() {
		const camera = Workspace.CurrentCamera!;
		const cameraPositions = Workspace.StartCutsceneCameraPositions.GetChildren() as Part[];

		camera.CameraType = Enum.CameraType.Scriptable;
		cameraPositions.sort((a, b) => {
			const aNumber = tonumber(a.Name)!;
			const bNumber = tonumber(b.Name)!;
			return aNumber < bNumber;
		});

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
	}

	private EndCutscene() {
		const camera = Workspace.CurrentCamera!;
		const tweenInfo = new TweenInfo(4, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
		const tween = TweenService.Create(CURTAIN, tweenInfo, {
			CFrame: ORIGINAL_CURTAIN_CFRAME,
		});
		tween.Play();
		camera.CameraType = Enum.CameraType.Custom;
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
				default:
					warn("Invalid cutscene passed");
					break;
			}
		});

		UPDATE_ACTIVE_PLAYER_EVENT.connect((index) => {
			const camera = Workspace.CurrentCamera!;
			const floor = Workspace.TrapDoors.FindFirstChild(tostring(index)) as Part;

			const CameraPosition = floor.CFrame.mul(new CFrame(0, 7, -6)).mul(CFrame.Angles(0, math.rad(180), 0));

			const tweenInfo = new TweenInfo(5, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
			const tween = TweenService.Create(camera, tweenInfo, {
				CFrame: CameraPosition,
			});
			tween.Play();
		});
	}
}

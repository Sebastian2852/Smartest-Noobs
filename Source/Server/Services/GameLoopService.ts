import { OnStart, Service } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { GetConfig } from "Shared/Modules/Utils";
import StatusService from "./StatusService";
import { Logger } from "Shared/Modules/Logger";
import DataService from "./DataService";
import { Trove } from "@rbxts/trove";

const SERVER_CONFIG = GetConfig();
const PLAYERS_NEEDED_TO_START_GAME = SERVER_CONFIG.GameLoop.PlayersNeededToStart;
const INTERMISSION_LENGTH = SERVER_CONFIG.GameLoop.IntermissionTime;

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
			Logger.Warn("Couldn't find podium for player, server player limit too high?");
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
		Logger.Trace("Starting game loop");
		game.BindToClose(() => {
			Logger.Debug("Server closing, disabling game loop");
			this.ServerClosing = true;
		});

		Logger.Debug("Starting game loop");
		while (!this.ServerClosing) {
			const playersInGame = this.GetPlayerCount();

			// Make sure there are enough players
			if (playersInGame < PLAYERS_NEEDED_TO_START_GAME) {
				this.StatusService.UpdateStatus("Not enough players");
				task.wait(1);
				continue;
			}

			Logger.Trace("Starting intermission");
			this.StatusService.UpdateStatus("Intermission");
			this.StatusService.StartCountdown(INTERMISSION_LENGTH);
			const playingPlayers = this.GetPlayersReady();
			const gameTrove = new Trove();

			// While the intermission timer is going and nothing is going on we can
			// already start giving people stands and setting up game area
			const assignPromise = new Promise<void>((resolve) => {
				// Randomise the order of players
				const rng = new Random(os.time());
				rng.Shuffle(playingPlayers);

				playingPlayers.forEach((player, index) => {
					const [stand, resetStandPos] = this.GiveStand(player, index);
					gameTrove.add(stand);
					gameTrove.add(resetStandPos);
				});

				resolve();
			});

			task.wait(INTERMISSION_LENGTH);

			// In case the stands are still somehow being given out
			const status = assignPromise.getStatus();
			if (status !== Promise.Status.Resolved) {
				Logger.Warn("Game not ready yet?");
				this.StatusService.UpdateStatus("Setting up game");
				assignPromise.await();
			}

			// START CUTSCENE

			task.wait(1);

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

				Humanoid.WalkSpeed = 0;
				Humanoid.JumpHeight = 0;
				character.PivotTo(trapdoor.CFrame.add(new Vector3(0, 5, 0)));
			});

			this.StatusService.UpdateStatus("TESTING");
			this.StatusService.StartCountdown(10);
			task.wait(10);

			gameTrove.destroy();
			playingPlayers.forEach((player) => player.LoadCharacter());
		}
	}

	constructor(private StatusService: StatusService, private DataService: DataService) {}
}

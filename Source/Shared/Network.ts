import { Networking } from "@flamework/networking";
import { Cutscenes, PlayerDataTemplate } from "./Modules/Types";

interface ClientToServerEvents {
	AnswerQuestion(answer: string): boolean;
}

interface ServerToClientEvents {
	UpdateStatus(newStatus: string): void;
	StartTimer(timerLength: number): void;
	StopTimer(): void;

	StartCutscene(cutscene: Cutscenes): void;
	UpdateActivePlayer(index: number): void;

	ShowGameGui(): void;

	Question(questionText: string, questionTime: number): void;
	HideQuestion(): void;

	Data: {
		UpdateData(data: typeof PlayerDataTemplate): void;
	};
}

interface ClientToServerFunctions {
	GetCurrentStatus(): string;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();

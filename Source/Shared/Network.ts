import { Networking } from "@flamework/networking";
import { PlayerDataTemplate } from "./Modules/Types";

interface ClientToServerEvents {}

interface ServerToClientEvents {
	UpdateStatus(newStatus: string): void;
	StartTimer(timerLength: number): void;

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

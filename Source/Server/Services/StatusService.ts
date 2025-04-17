import { OnStart, Service } from "@flamework/core";
import { Events, Functions } from "Server/Network";

const UPDATE_STATUS_EVENT = Events.UpdateStatus;
const GET_STATUS_FUNCTION = Functions.GetCurrentStatus;

const START_TIMER_EVENT = Events.StartTimer;

// Status system has been seperated into its own service
// this service will also contain functions to update the timer

@Service()
export default class StatusService implements OnStart {
	private CurrentStatus = "";

	public UpdateStatus(newStatus: string) {
		if (newStatus === this.CurrentStatus) {
			return;
		}

		UPDATE_STATUS_EVENT.broadcast(newStatus);
		this.CurrentStatus = newStatus;
	}

	public StartCountdown(time: number) {
		START_TIMER_EVENT.broadcast(time);
	}

	onStart(): void {
		GET_STATUS_FUNCTION.setCallback(() => {
			return this.CurrentStatus;
		});
	}
}

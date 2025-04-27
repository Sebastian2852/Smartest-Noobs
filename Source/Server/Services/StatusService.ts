import { OnStart, Service } from "@flamework/core";
import { Events, Functions } from "Server/Network";
import { Logger } from "Shared/Modules/Logger";

const UPDATE_STATUS_EVENT = Events.UpdateStatus;
const GET_STATUS_FUNCTION = Functions.GetCurrentStatus;

const START_TIMER_EVENT = Events.StartTimer;
const STOP_TIMER_EVENT = Events.StopTimer;

// Status system has been seperated into its own service
// this service will also contain functions to update the timer

@Service()
export default class StatusService implements OnStart {
	private CurrentStatus = "";

	public UpdateStatus(newStatus: string) {
		if (newStatus === this.CurrentStatus) {
			Logger.Trace("New status same as old status; not updating");
			return;
		}

		UPDATE_STATUS_EVENT.broadcast(newStatus);
		this.CurrentStatus = newStatus;
		Logger.Debug("Updated status message to: " + newStatus);
	}

	public StartCountdown(time: number) {
		START_TIMER_EVENT.broadcast(time);
		Logger.Debug("Started countdown lasting: " + tostring(time));
	}

	public CancelCountdown() {
		STOP_TIMER_EVENT.broadcast();
	}

	onStart(): void {
		GET_STATUS_FUNCTION.setCallback(() => {
			return this.CurrentStatus;
		});
	}
}

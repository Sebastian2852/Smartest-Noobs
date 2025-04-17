import { Service } from "@flamework/core";
import { Events } from "Server/Network";

const UPDATE_STATUS_EVENT = Events.UpdateStatus;

// Status system has been seperated into its own service
// this service will also contain functions to update the timer

@Service()
export default class StatusService {
	public UpdateStatus(newStatus: string) {
		UPDATE_STATUS_EVENT.broadcast(newStatus);
	}
}

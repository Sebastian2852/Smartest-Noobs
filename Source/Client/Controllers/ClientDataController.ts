import { Controller, OnStart } from "@flamework/core";
import { Events } from "Client/Network";
import { PlayerDataTemplate } from "Shared/Modules/Types";

const UPDATE_DATA_EVENT = Events.Data.UpdateData;

@Controller()
export default class ClientDataController implements OnStart {
	private Data = PlayerDataTemplate;

	onStart() {
		UPDATE_DATA_EVENT.connect((data) => (this.Data = data));
	}
}

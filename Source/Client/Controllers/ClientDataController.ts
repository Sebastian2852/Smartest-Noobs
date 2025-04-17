import { Controller, OnStart } from "@flamework/core";
import { Events } from "Client/Network";
import { Logger } from "Shared/Modules/Logger";
import { PlayerDataTemplate } from "Shared/Modules/Types";

const UPDATE_DATA_EVENT = Events.Data.UpdateData;

@Controller()
export default class ClientDataController implements OnStart {
	private Data = PlayerDataTemplate;

	private OnUpdateDataEvent(newData: typeof PlayerDataTemplate) {
		this.Data = newData;
		Logger.Debug("Updated client's data");
	}

	onStart() {
		UPDATE_DATA_EVENT.connect((data) => this.OnUpdateDataEvent(data));
	}
}

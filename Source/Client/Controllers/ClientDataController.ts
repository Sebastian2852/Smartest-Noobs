import { Controller, OnStart } from "@flamework/core";
import Signal from "@rbxutil/signal";
import { Events } from "Client/Network";
import { PlayerDataTemplate } from "Shared/Modules/Types";

const UPDATE_DATA_EVENT = Events.Data.UpdateData;

@Controller()
export default class ClientDataController implements OnStart {
	private Data = PlayerDataTemplate;
	public DataChanged = new Signal<typeof PlayerDataTemplate>();

	public GetData() {
		return this.Data;
	}

	private OnUpdateDataEvent(newData: typeof PlayerDataTemplate) {
		this.Data = newData;
		this.DataChanged.Fire(this.Data);
	}

	onStart() {
		UPDATE_DATA_EVENT.connect((data) => this.OnUpdateDataEvent(data));
	}
}

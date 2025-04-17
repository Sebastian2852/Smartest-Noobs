import { RunService, ServerScriptService } from "@rbxts/services";
import { ServerConfig } from "./Types";

function _GetServerConfigModule(): ModuleScript {
	return ServerScriptService.ServerConfig;
}

export function GetConfig() {
	if (RunService.IsServer()) {
		return require(_GetServerConfigModule()) as ServerConfig;
	} else {
		error("Client context doesnt have a config yet");
	}
}

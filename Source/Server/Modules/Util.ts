import { ServerScriptService } from "@rbxts/services";
import { QuestionModule } from "Shared/Modules/Types";

export function GetQuestionsData() {
	return require(ServerScriptService.Questions) as QuestionModule;
}

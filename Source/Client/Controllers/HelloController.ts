import { Controller, OnStart } from "@flamework/core";

@Controller()
export default class HelloController implements OnStart {
	onStart() {
		print("Hello World");
	}
}

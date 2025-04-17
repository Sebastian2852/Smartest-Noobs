import { OnStart, Service } from "@flamework/core";

@Service()
export default class HelloService implements OnStart {
	onStart() {
		print("Hello World");
	}
}

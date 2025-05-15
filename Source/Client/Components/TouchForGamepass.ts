import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { MarketplaceService, Players, RunService } from "@rbxts/services";

interface TouchForGamepassAttributes {
	gamepassId: number;
}

@Component({
	tag: "TouchForGamepass",
})
export default class TouchForGamepass extends BaseComponent<TouchForGamepassAttributes, BasePart> implements OnStart {
	onStart() {
		const part = this.instance;

		const player = Players.LocalPlayer;
		if (MarketplaceService.UserOwnsGamePassAsync(player.UserId, this.attributes.gamepassId)) {
			this.destroy();
		}

		part.Touched.Connect((other) => {
			if (other.FindFirstAncestorWhichIsA("Model")?.FindFirstChildWhichIsA("Humanoid") === undefined) return;
			const character = other.FindFirstAncestorWhichIsA("Model");
			assert(character, "Model found and then not found??");
			const player = Players.GetPlayerFromCharacter(character);
			if (player === undefined) return;

			MarketplaceService.PromptGamePassPurchase(player, this.attributes.gamepassId);
		});
	}
}

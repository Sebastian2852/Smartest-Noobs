import { Flamework } from "@flamework/core";
import { CmdrClient } from "@rbxts/cmdr";

Flamework.addPaths("Source/Client/Components");
Flamework.addPaths("Source/Client/Controllers");
Flamework.addPaths("Source/Client/Components");

Flamework.ignite();

CmdrClient.SetActivationKeys([Enum.KeyCode.Minus]);

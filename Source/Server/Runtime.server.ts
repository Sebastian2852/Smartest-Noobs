import { Flamework } from "@flamework/core";
import { Cmdr } from "@rbxts/cmdr";
import { ServerScriptService } from "@rbxts/services";

Flamework.addPaths("Source/Server/Components");
Flamework.addPaths("Source/Server/Services");
Flamework.addPaths("Source/Shared/Components");

Flamework.ignite();

Cmdr.RegisterDefaultCommands();
Cmdr.RegisterHooksIn(ServerScriptService.Game.Cmdr.Hooks);
Cmdr.RegisterTypesIn(ServerScriptService.Game.Cmdr.Types);
Cmdr.RegisterCommandsIn(ServerScriptService.Game.Cmdr.Commands);

local ServerScriptService = game:GetService("ServerScriptService")
return function (context, stand)
	ServerScriptService.Game.Cmdr.RunEvents.SetStand:Fire(context.Executor, stand)
	return "Set equipped stand to: " .. stand
end
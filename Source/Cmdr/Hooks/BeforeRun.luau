local Admins = {
	3092257097,
	717562972,
}

return function (registry)
	registry:RegisterHook("BeforeRun", function(context)
		if context.Group == "Admin" and not table.find(Admins, context.Executor.UserId) then
			return "You don't have permission to run this command"
		end
	end)
end
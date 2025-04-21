local ReplicatedStorage = game:GetService("ReplicatedStorage")
return function (registry)
	local stands = ReplicatedStorage.Stands

	local a = {}

	for _, v in pairs(stands:GetChildren()) do
		table.insert(a, v.Name)
	end

	registry:RegisterType("stand", registry.Cmdr.Util.MakeEnumType("Stand", a))
end
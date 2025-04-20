export interface ServerConfig {
	GameLoop: {
		PlayersNeededToStart: number;
		IntermissionTime: number;
	};
}

export const PlayerDataTemplate = {
	Wins: 0,

	EquippedStand: "Default",
	Stands: new Map<string, boolean>(),
};

export const enum Cutscenes {
	Start,
	End,
}

export interface ServerConfig {
	GameLoop: {
		PlayersNeededToStart: number;
		IntermissionTime: number;
	};
}

export const PlayerDataTemplate = {
	Wins: 0,
};

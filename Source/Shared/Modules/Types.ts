type QuestionData = {
	QuestionTime: number;
	Subjects: Map<
		string,
		Map<
			number,
			{
				Question: string;
				Answer: {
					Answer: unknown;
					AnswerType: string;
					ExactString: boolean;
				};
				Reward: number;
			}
		>
	>;
};

export type QuestionModule = Map<number, QuestionData>;

export interface ServerConfig {
	GameLoop: {
		PlayersNeededToStart: number;
		IntermissionTime: number;
	};
}

export const PlayerDataTemplate = {
	Wins: 0,
	Coins: 0,

	EquippedStand: "Default",
	Stands: new Map<string, boolean>(),
};

export const enum Cutscenes {
	Start,
	End,
}

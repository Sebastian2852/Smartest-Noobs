interface HasGameGui {
	ScreenGui: ScreenGui & {
		Stats: Frame & {
			Wins: ImageLabel & {
				UICorner: UICorner;
				Wins: ImageLabel & {
					Text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
			};
			Coins: ImageLabel & {
				UICorner: UICorner;
				Coins: ImageLabel & {
					Text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
			};
		};
		TimerRound: Frame & {
			Centre: ImageLabel;
			IconRed: ImageLabel;
			UICorner: UICorner;
			UIGradient: UIGradient;
			TextLabel: TextLabel & {
				UIStroke: UIStroke;
			};
			Icon: ImageLabel;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
		};
		Shop: ImageLabel & {
			CloseButton: ImageButton;
			Title: TextLabel & {
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
				};
			};
			GamepassesTitle: ImageLabel;
			CoinsTitle: ImageLabel;
			Gamepasses: ScrollingFrame & {
				ExtraHealth: ImageButton & {
					Price: TextLabel;
					ImageLabel: ImageLabel;
					Description: TextLabel & {
						UITextSizeConstraint: UITextSizeConstraint;
					};
					Robux: ImageLabel;
				};
				UIGridLayout: UIGridLayout;
				["X2 Coins"]: ImageButton & {
					Price: TextLabel;
					ImageLabel: ImageLabel;
					Description: TextLabel & {
						UITextSizeConstraint: UITextSizeConstraint;
					};
					Robux: ImageLabel;
				};
			};
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			Coins: ScrollingFrame & {
				UIGridLayout: UIGridLayout;
			};
		};
		Buttons: Frame & {
			Stands: ImageButton & {
				Notfication: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
				["Sword Icon"]: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				UICorner: UICorner;
				Text: TextLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStroke: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				UIGradient: UIGradient;
			};
			Shop: ImageButton & {
				Shop: ImageLabel & {
					LocalScript: LocalScript;
				};
				UIGradient: UIGradient;
				UICorner: UICorner;
				Text: TextLabel & {
					UIStroke: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			Crates: ImageButton & {
				UIGradient: UIGradient;
				["Sword Icon"]: ImageLabel;
				UICorner: UICorner;
				Text: TextLabel & {
					UIStroke: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			UIAspectRatioConstraint: UIAspectRatioConstraint;
		};
		Stands: Frame & {
			Stands: Frame & {
				Items: ScrollingFrame & {
					UIListLayout: UIListLayout & {
						Template: ImageLabel & {
							SwordName: TextLabel & {
								UIStroke: UIStroke;
							};
							NotOwned: ImageLabel & {
								UICorner: UICorner;
								ImageLabel: ImageLabel;
							};
							Equip: ImageButton & {
								UICorner: UICorner;
								text: TextLabel & {
									UIStroke: UIStroke;
								};
								UIStroke: UIStroke;
							};
							ItemImage: ImageLabel;
						};
					};
				};
			};
			BackGround: ImageLabel & {
				UICorner: UICorner;
				CloseButton: ImageButton & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					["Sword Icon"]: ImageLabel;
				};
				Icon: ImageLabel & {
					UIGradient: UIGradient;
					Text: TextLabel & {
						UIStroke: UIStroke;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					["Sword Icon"]: ImageLabel;
				};
				UIStroke: UIStroke;
			};
			UIAspectRatioConstraint: UIAspectRatioConstraint;
		};
		QuestionBar: Frame & {
			QuestionText: TextLabel & {
				UIStroke: UIStroke;
			};
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			InputArea: ImageLabel & {
				SubmitButton: ImageButton;
				InputBox: TextBox & {
					UITextSizeConstraint: UITextSizeConstraint;
				};
			};
		};
		Crates: Frame & {
			CloseButton: ImageButton & {
				XButton: ImageLabel;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			Lucks: Frame & {
				Items: ScrollingFrame & {
					UIListLayout: UIListLayout;
					["SILVER CRATE"]: ImageLabel & {
						BuyCoins: ImageButton & {
							UICorner: UICorner;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
							Gems: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIStroke: UIStroke;
						};
						BuyRobuxs: ImageButton & {
							UICorner: UICorner;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
							Gems: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIStroke: UIStroke;
						};
						LuckName: TextLabel & {
							UIStroke: UIStroke;
						};
						ItemImage: ImageLabel;
					};
					GoldCrate: ImageLabel & {
						BuyCoins: ImageButton & {
							UICorner: UICorner;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
							UIStroke: UIStroke;
							Gems: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
						};
						BuyRobuxs: ImageButton & {
							UICorner: UICorner;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
							UIStroke: UIStroke;
							Gems: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
						};
						LuckName: TextLabel & {
							UIStroke: UIStroke;
						};
						ItemImage: ImageLabel;
					};
					BasicCrate: ImageLabel & {
						BuyRobuxs: ImageButton & {
							UICorner: UICorner;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
							Gems: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIStroke: UIStroke;
						};
						BuyCoins: ImageButton & {
							UICorner: UICorner;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
							Gems: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIStroke: UIStroke;
						};
						LuckName: TextLabel & {
							UIStroke: UIStroke;
						};
						ItemImage: ImageLabel;
					};
				};
			};
			Background: ImageLabel & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				UIGradient: UIGradient;
				ItemImage: ImageLabel;
			};
		};
		Timer: ImageLabel & {
			TimerMessage: TextLabel;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			CountDown: TextLabel;
		};
	};

	FullScreen: ScreenGui & {
		Transition: Frame;
	};
}

interface GradeLevel extends Model {
	["Meshes/SpawnThing_Cube.004"]: MeshPart;
	["Meshes/SpawnThing_Cube.001"]: MeshPart;
	board: MeshPart & {
		SurfaceGui: SurfaceGui & {
			GradeLevel: TextLabel & {
				UIStroke: UIStroke;
			};
			GradeSubject: TextLabel & {
				UIStroke: UIStroke;
			};
		};
		Texture: Texture;
	};
}

interface PlayerGui extends BasePlayerGui, HasGameGui {}

interface ServerScriptService extends Instance {
	ServerConfig: ModuleScript;
	Questions: ModuleScript;
	Game: Folder & {
		Cmdr: Folder & {
			Hooks: Folder;
			Types: Folder;
			Commands: Folder;
			RunEvents: Folder & {
				SetStand: BindableEvent;
				ResetData: BindableEvent;
			};
		};
	};
}

interface ReplicatedStorage extends Instance {
	Stands: Folder;
}

interface Workspace extends Instance {
	Podiums: Folder;
	TrapDoors: Folder;
	StartCutsceneCameraPositions: Folder;
	GameParts: Folder & {
		Curtain: UnionOperation;
		PlayerSpotLight: Part;
		GradeLevel: GradeLevel;
	};
	LobbyLights: Folder;
}

interface HasGameGui {
	ScreenGui: ScreenGui & {
		QuestionBar: Frame & {
			InputArea: ImageLabel & {
				UIGradient: UIGradient;
				SubmitButton: ImageButton & {
					XButton: ImageLabel & {
						Text: TextLabel & {
							UITextSizeConstraint: UITextSizeConstraint;
							UIStroke: UIStroke;
						};
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				UICorner: UICorner;
				UIStroke: UIStroke;
				InputBox: TextBox & {
					UIStroke: UIStroke;
				};
				ItemImage: ImageLabel;
			};
			QuestionText: TextLabel & {
				UITextSizeConstraint: UITextSizeConstraint;
				UIStroke: UIStroke;
			};
		};

		Stats: Frame & {
			Wins: ImageLabel & {
				Wins: ImageLabel & {
					Text: TextLabel;
				};
			};
			Coins: ImageLabel & {
				Coins: ImageLabel & {
					Text: TextLabel;
				};
			};
		};
		Buttons: Frame & {
			Stands: ImageButton & {
				UIGradient: UIGradient;
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
				UIStroke: UIStroke;
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
				UIStroke: UIStroke;
			};
			Crates: ImageButton & {
				UIGradient: UIGradient;
				["Sword Icon"]: ImageLabel;
				UICorner: UICorner;
				Text: TextLabel & {
					UIStroke: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				UIStroke: UIStroke;
			};
			UIAspectRatioConstraint: UIAspectRatioConstraint;
		};
		Stands: Frame & {
			Stands: Frame & {
				Items: ScrollingFrame & {
					UIListLayout: UIListLayout;
					Stands: ImageLabel & {
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
		TopBar: Frame & {
			TopBar: ImageLabel & {
				UICorner: UICorner;
				Text: TextLabel & {
					UIStroke: UIStroke;
				};
				WinsBackground: ImageLabel & {
					UICorner: UICorner;
					Text: TextLabel & {
						UIStroke: UIStroke;
					};
					HourGlass: ImageLabel & {
						LocalScript: LocalScript;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIStroke: UIStroke;
				};
				UIStroke: UIStroke;
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
	};
}

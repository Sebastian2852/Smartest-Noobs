let MaxCallerLength = 0;

function GetCallerInfo(UpLevel: number): string {
	const FullNameOfCaller: string = debug.info(UpLevel, "s")[0];
	const SplitNameCaller = FullNameOfCaller.split(".");
	const Name: string = SplitNameCaller[SplitNameCaller.size() - 1];

	const LineText = tostring(debug.info(UpLevel, "l")[0]);
	let Function = debug.info(UpLevel, "n")[0];

	if (Function === "" || Function === " " || Function === undefined) {
		Function = "<anonymous>";
	}

	return `${Function} - ${Name}:${LineText}`;
}

function Format(Level: string, Message: string): string {
	const caller = GetCallerInfo(4);

	if (caller.size() > MaxCallerLength) {
		MaxCallerLength = caller.size();
	}

	const Padding = string.rep(" ", MaxCallerLength - caller.size());
	return `[${Level.upper()}] [${caller}] ${Padding} ${Message}`;
}

export const Logger = {
	Trace(Message: string) {
		print(Format("TRACE", Message));
	},
	Debug(Message: string) {
		print(Format("DEBUG", Message));
	},
	Warn(Message: string) {
		warn(Format("WARN ", Message));
	},
	Error(Message: string) {
		error(Format("ERROR", Message));
	},
};

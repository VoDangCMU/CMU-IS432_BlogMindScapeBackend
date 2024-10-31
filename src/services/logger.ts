import chalk from "chalk";
import env from "@root/env";

type LogLevel = "info" | "warn" | "error";

const prefix = {
	info: chalk.bgBlue.bold.green(" INFO "),
	warn: chalk.bgYellow.bold.black(" WARN "),
	error: chalk.bgRed.bold.blue(" ERROR "),
};

const log = {
	info(...data: any[]) {
		if (env.ENV === "production" || env.ENV === "staging")
			return;
		console.log(prefix['info'], ...data);
	},

	warn(...data: any[]) {
		if (env.ENV === "production") return;
		console.log(prefix['warn'], ...data);
	},

	error(...data: any[]) {
		console.log(prefix['error'], ...data);
	}
}

export default log; 
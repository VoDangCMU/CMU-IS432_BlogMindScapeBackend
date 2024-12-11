import chalk from 'chalk';
import env from '../env';

type LogLevel = 'info' | 'warn' | 'error' | 'status';

const prefix = {
	info: chalk.bgBlue.bold.green(' INFO '),
	warn: chalk.bgYellow.bold.black(' WARN '),
	error: chalk.bgRed.bold.blue(' ERROR '),
	status: chalk.bgMagenta.bold.white(' STATUS '),
	socket: chalk.bgWhite.bold.black(' MESSAGE '),
	success: chalk.bgGreen.bold.white(' SUCCESS '),
};

const log = {
	info(...data: any[]) {
		if (env.ENV === 'production' || env.ENV === 'staging') return;
		console.log(prefix['info'], ...data);
	},

	warn(...data: any[]) {
		if (env.ENV === 'production') return;
		console.log(prefix['warn'], ...data);
	},

	error(...data: any[]) {
		console.log(prefix['error'], ...data);
	},

	status(...data: any[]) {
		console.log(prefix['status'], ...data);
	},

	socket(...data: any[]) {
		if (env.ENV === 'production' || env.ENV === 'staging') return;
		console.log(prefix['socket'], ...data);
	},

	success(...data: any[]) {
		console.log(prefix['success'], ...data);
	},
};

export default log;

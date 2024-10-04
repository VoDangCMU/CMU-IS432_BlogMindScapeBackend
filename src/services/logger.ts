import env from "src/env";
import chalk from 'chalk';

type LogLevel = 'info' | 'warn' | 'error';

/**
 * 
 * @param logLevel
 * @param data 
 * @returns 
 */
export default function log(logLevel: LogLevel, ...data: any[]) {
  if (env.ENV == 'production' && logLevel != 'error') return;
  if (env.ENV == 'staging' && logLevel == 'info') return;

  const prefix = {
    "info": chalk.bgBlue.bold.green(" INFO "),
    "warn": chalk.bgYellow.bold.black(" WARN "),
    "error": chalk.bgRed.bold.blue(" ERROR ")
  }
  console.log(prefix[logLevel], ...data);
}
import { exec } from 'child_process';
import path from 'path';
import logger from '../services/logger';
const migrationsPath = path.resolve(__dirname, '..', 'database', 'migrations');
const dataSourcePath = path.resolve(
	__dirname,
	'..',
	'database',
	'DataSource.ts',
);

const now = new Date().getTime().toString();
const migrationName = process.argv.slice(2)[0];

function run() {
	if (!migrationName) {
		logger.error('Migration name is missing');
		return;
	}

	logger.info(`Creating migration ${migrationName}`);

	const migrationFilePath = path.resolve(migrationsPath, `${migrationName}`);

	exec(
		`yarn typeorm migration:create ${migrationFilePath}`,
		(error, stdout, stderr) => {
			if (error) {
				logger.error(error);
				return;
			}
			logger.info(stdout);
		},
	);
}

run();

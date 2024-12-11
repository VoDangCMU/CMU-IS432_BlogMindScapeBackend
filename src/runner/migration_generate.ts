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

const migrationName = process.argv.slice(2)[0];

function run() {
	if (!migrationName) {
		logger.error('Migration name is missing');
		return;
	}

	logger.info(`Generating migration ${migrationName}`);

	const migrationFilePath = path.resolve(migrationsPath, `${migrationName}`);

	exec(
		`yarn typeorm migration:generate ${migrationFilePath} -d ${dataSourcePath}`,
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

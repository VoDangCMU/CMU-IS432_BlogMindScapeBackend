import { DataSource, DataSourceOptions } from 'typeorm';

import env from '../env';

export const AppDataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: env.DB_HOST,
	port: env.DB_PORT,
	username: env.DB_USERNAME,
	password: env.DB_PASSWORD,
	database: `${env.DB_DATABASE}_${env.ENV}`,
	synchronize: false,
	logging: env.ENV !== 'production' && env.ENV !== 'testing',
	entities: [__dirname + '/models/*.{js,ts}'],
	subscribers: [],
	migrations: [__dirname + '/migrations/*.{js,ts}'],
};

export const AppDataSource = new DataSource(AppDataSourceOptions);

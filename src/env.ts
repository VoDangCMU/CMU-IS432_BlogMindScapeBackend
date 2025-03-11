import { z } from 'zod';
import { config } from 'dotenv';
import STRING from './database/DataSchema/STRING';
import NUMBER from './database/DataSchema/NUMBER';

config();

const portPerEnv = {
	development: 4000,
	staging: 4000,
	production: 5000,
	testing: 4455,
};

const envSchema = z.object({
	TOKEN_SECRET: STRING,
	ENV: z
		.union([
			z.literal('development'),
			z.literal('staging'),
			z.literal('production'),
			z.literal('testing'),
		])
		.default('development'),
	DB_HOST: STRING,
	DB_PORT: NUMBER,
	DB_USERNAME: STRING,
	DB_PASSWORD: STRING,
	DB_DATABASE: STRING,
	SALT_ROUND: NUMBER,
	APPLICATION_PORT: NUMBER.optional(),
});

const env = envSchema.parse(process.env);

env.APPLICATION_PORT = portPerEnv[env.ENV];

export default env;

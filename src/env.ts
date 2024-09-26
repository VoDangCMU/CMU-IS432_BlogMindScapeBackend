import { z } from 'zod'
import { config } from 'dotenv'
import { CommonSchema } from './schemas';

config();

const portPerEnv = {
  development: 4000,
  staging: 4000,
  production: 5000
}

const envSchema = z.object({
  TOKEN_SECRET: z.string(),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('staging'),
      z.literal('production'),
    ])
    .default('development'),
  DB_HOST: z.string().ip(),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  SALT_ROUND: z.string().regex(/^\d+$/).transform(Number),
  APPLICATION_PORT: CommonSchema.NumberSchema.optional()
})

const env = envSchema.parse(process.env)

env.APPLICATION_PORT = portPerEnv[env.ENV];

export default env;
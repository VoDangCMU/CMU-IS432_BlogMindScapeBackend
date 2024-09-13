import { z } from 'zod'
import { config } from 'dotenv'

config();

const envSchema = z.object({
  TOKEN_SECRET: z.string(),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('testing'),
      z.literal('production'),
    ])
    .default('development'),
  DB_HOST: z.string().ip(),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  SALT_ROUND: z.string().regex(/^\d+$/).transform(Number)
})

const env = envSchema.parse(process.env)

export default env;
import * as joi from 'joi';

export const envSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: joi.number().integer().min(0).max(65535).required(),
    DATABASE_URL: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
  })
  .unknown(true);

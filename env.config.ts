import * as joi from 'joi';

export const envSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: joi.number().integer().min(0).max(65535).required(),
    HOST: joi.string().required(),
    DATABASE_URL:joi.string().required(),
   
  //Nats configuration
   NATS_URL:joi.string().required(),

  })
  .unknown(true);

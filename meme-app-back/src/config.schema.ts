import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().default('dev'),
  PORT: Joi.string().required(),

  PGHOST: Joi.string().required(),
  PGPORT: Joi.number().default(5432),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGDATABASE: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  OAUTH_CLIENT_ID: Joi.string().required(),
  OAUTH_CLIENT_SECRET: Joi.string().required(),
  OAUTH_CALLBACK_URL: Joi.string().required(),

  UPLOADTHING_TOKEN: Joi.string().required(),
  UPLOADTHING_SECRET: Joi.string().required(),
  UPLOADTHING_APP_ID: Joi.string().required(),

  THROTTLER_TTL: Joi.number().required(),
  THROTTLER_LIMIT: Joi.number().required(),
});

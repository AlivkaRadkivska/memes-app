import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().default('dev'),
  PORT: Joi.string().required(),
  PGHOST: Joi.string().required(),
  PGPORT: Joi.number().default(5432),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGDATABASE: Joi.string().required(),
});

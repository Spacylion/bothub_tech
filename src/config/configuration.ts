import * as Joi from 'joi';
import * as process from 'node:process';

export default () => {
  const postgresDatabaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  const openAiAPIKey = process.env.OPEN_AI_API;

  return {
    database: {
      postgres_db_url: postgresDatabaseUrl,
    },
    bothub: {
      base_uri: 'https://bothub.chat/api/v2/openai/v1',
      open_ai_api_key: openAiAPIKey,
    },
    jwt_secret: jwtSecret,
  };
};

export const configurationValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  OPEN_AI_API: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
import * as Joi from 'joi';
import * as process from 'node:process';

export default () => {
  const postgresDatabaseUrl = process.env.DATABASE_URL;
  const mistralApiKey = process.env.MISTRAL_API_KEY;
  const chatGptV3ApiKey = process.env.CHATGPT_V3_API_KEY;
  const jwtSecret = process.env.JWT_SECRET;

  console.log('Fetched Environment Variables:');
  console.log(`DATABASE_URL: ${postgresDatabaseUrl}`);

  return {
    database: {
      postgres_db_url: postgresDatabaseUrl,
    },
    mistral_api_key: mistralApiKey,
    chat_gpt_v3_api_key: chatGptV3ApiKey,
    jwt_secret: jwtSecret,
  };
};

export const configurationValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  MISTRAL_API_KEY: Joi.string().required(),
  CHATGPT_V3_API_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
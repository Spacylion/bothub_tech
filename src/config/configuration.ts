import * as Joi from 'joi';
import * as process from 'node:process';

export default () => {
  const postgresDatabaseUrl = process.env.DATABASE_URL;
  const redisUrl = process.env.REDIS_URL;

  console.log('Fetched Environment Variables:');
  console.log(`DATABASE_URL: ${postgresDatabaseUrl}`);
  console.log(`REDIS_URL: ${redisUrl}`);

  return {
    database: {
      postgres_db_url: postgresDatabaseUrl,
      redis_db_url: redisUrl,
    },
  };
};

export const configurationValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
});
import * as Joi from 'joi';
import * as process from 'node:process';

export default () => {
  const postgresDatabaseUrl = process.env.DATABASE_URL;

  console.log('Fetched Environment Variables:');
  console.log(`DATABASE_URL: ${postgresDatabaseUrl}`);

  return {
    database: {
      postgres_db_url: postgresDatabaseUrl,
    },
  };
};

export const configurationValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
});

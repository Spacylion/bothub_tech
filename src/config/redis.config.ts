import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export const REDIS_CONFIG_KEY = 'redis';

export default registerAs(REDIS_CONFIG_KEY, () => {
  const url = process.env.REDIS_URL;

  const host =
    url?.split('@')[1].split(':')[0] || process.env.REDISHOST || 'localhost';
  const password =
    url?.split(':')[2].split('@')[0] || process.env.REDISPASSWORD || '';
  const username =
    url?.split(':')[1].split('//')[1] || process.env.REDISUSER || '';
  const port =
    parseInt(url?.split(':')[3] || '', 10) ||
    parseInt(process.env.REDISPORT || '6379', 10);

  let tls;
  if (port === 6380) {
    tls = {};
  }

  return {
    host,
    port,
    username,
    password,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    tls,
  };
});

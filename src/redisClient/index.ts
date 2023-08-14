import { env } from '@/config';
import { createClient } from 'redis';

const REDIS_HOST = env('REDIS_HOST');
const REDIS_USERNAME = env('REDIS_USERNAME');
const REDIS_PASSWORD = env('REDIS_PASSWORD');
const REDIS_PORT = env('REDIS_PORT');
const REDIS_DB = env('REDIS_DB');

export const redisClient = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
});

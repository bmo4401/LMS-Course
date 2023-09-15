import { Redis } from 'ioredis';
import env from './env';
const redisClient = () => {
  if (env.REDIS_URL) {
    console.log('Redis connected');
    return env.REDIS_URL;
  }
  throw new Error('Redis connection failed');
};

export const redis = new Redis(redisClient());

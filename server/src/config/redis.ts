import IORedis from "ioredis";
import { env } from "./env";

export const redis = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

export const createRedisConnection = () =>
  new IORedis(env.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });

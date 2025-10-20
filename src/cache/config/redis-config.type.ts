export type RedisConfig = {
  redisHost?: string;
  redisPort?: number;
  isClusterMode?: boolean;
  defaultTTL?: number;
  password?: string;
};

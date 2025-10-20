import { registerAs } from '@nestjs/config';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { RedisConfig } from '@src/cache/config/redis-config.type';
import validateConfig from '@src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsNumber()
  REDIS_DEFAULT_TTL: number;

  @IsBoolean()
  REDIS_IS_CLUSTER_MODE: boolean;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    redisHost: process.env.REDIS_HOST,
    redisPort: Number(process.env.REDIS_PORT),
    defaultTTL: Number(process.env.REDIS_DEFAULT_TTL),
    password: process.env.REDIS_PASSWORD,
    isClusterMode:
      process.env.REDIS_IS_CLUSTER_MODE &&
      process.env.REDIS_IS_CLUSTER_MODE == 'true'
        ? true
        : false,
  };
});

import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import validateConfig from '@src/utils/validate-config';

import { AppConfig } from './app-config.type';

enum Environment {
  Local = 'local',
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  SWAGGER_USERNAME: string;

  @IsString()
  SWAGGER_PASSWORD: string;

  @IsString()
  @IsOptional()
  ALLOWED_ORIGINS: string;

  @IsBoolean()
  @IsOptional()
  ENABLE_CRON_JOBS: boolean;

  @IsBoolean()
  @IsOptional()
  IDEMPOTENCY_ENABLED: boolean;
  
  @IsUrl({ require_tld: false })
  @IsOptional()
  SENTRY_URL: string;
  
  @IsString()
  @IsOptional()
  MASKED_FIELDS: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    swaggerUsername: process.env.SWAGGER_USERNAME || 'admin',
    swaggerPassword: process.env.SWAGGER_PASSWORD || 'password',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
    enableCronJobs: process.env.ENABLE_CRON_JOBS === 'true',
    idempotencyEnabled: process.env.IDEMPOTENCY_ENABLED === 'true',
    sentryUrl: process.env.SENTRY_URL ?? '',
    maskedFields: process.env.MASKED_FIELDS
      ? process.env.MASKED_FIELDS.split(',')
      : [],
  };
});

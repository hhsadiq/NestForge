import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

import { HttpConfig } from '@src/http/config/http-config.type';
import validateConfig from '@src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  HTTP_MAX_REDIRECTS: string;

  @IsString()
  @IsOptional()
  HTTP_REQ_TIMEOUT: string;
}

export default registerAs<HttpConfig>('http', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    reqTimeout: process.env.HTTP_REQ_TIMEOUT
      ? parseInt(process.env.HTTP_REQ_TIMEOUT, 10)
      : 5,
    maxRedirects: process.env.HTTP_MAX_REDIRECTS
      ? parseInt(process.env.HTTP_MAX_REDIRECTS, 10)
      : 100000,
  };
});

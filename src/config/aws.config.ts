import { registerAs } from '@nestjs/config';
import { IsString, ValidateIf } from 'class-validator';

import validateConfig from '@src/utils/validate-config';

import { AwsConfig } from './aws-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.AWS_REGION)
  @IsString()
  AWS_REGION: string;

  @ValidateIf((envValues) => envValues.AWS_ACCESS_KEY_ID)
  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @ValidateIf((envValues) => envValues.AWS_SECRET_ACCESS_KEY)
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_LOGGING_GROUP: string;

  @IsString()
  AWS_LOGGING_STREAM: string;
}

export default registerAs<AwsConfig>('aws', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    loggingGroup: process.env.AWS_LOGGING_GROUP,
    loggingStream: process.env.AWS_LOGGING_STREAM,
  };
});

import { AuthConfig } from '@src/auth/config/auth-config.type';
import { AppleConfig } from '@src/auth-apple/config/apple-config.type';
import { FacebookConfig } from '@src/auth-facebook/config/facebook-config.type';
import { GoogleConfig } from '@src/auth-google/config/google-config.type';
import { TwitterConfig } from '@src/auth-twitter/config/twitter-config.type';
import { RedisConfig } from '@src/cache/config/redis-config.type';
import { DatabaseConfig } from '@src/database/config/database-config.type';
import { FileConfig } from '@src/files/config/file-config.type';
import { GenAiConfig } from '@src/gen-ai/config/gen-ai-config.type';
import { MailConfig } from '@src/mail/config/mail-config.type';

import { AppConfig } from './app-config.type';
import { AwsConfig } from '@src/config/aws-config.type';

export type AllConfigType = {
  app: AppConfig;
  apple: AppleConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  facebook: FacebookConfig;
  file: FileConfig;
  google: GoogleConfig;
  mail: MailConfig;
  twitter: TwitterConfig;
  genAi: GenAiConfig;
  redis: RedisConfig;
  aws: AwsConfig;
};

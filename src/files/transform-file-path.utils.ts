import { TransformFnParams } from 'class-transformer';

import { AppConfig } from '@src/config/app-config.type';
import appConfig from '@src/config/app.config';
import { FileConfig, FileDriver } from '@src/files/config/file-config.type';
import fileConfig from '@src/files/config/file.config';

export function transformFilePath(input: TransformFnParams | string): string {
  const value = typeof input === 'string' ? input : input.value;
  const fileDriver = (fileConfig() as FileConfig).driver;

  if (fileDriver === FileDriver.LOCAL) {
    return (appConfig() as AppConfig).backendDomain + value;
  } else if ([FileDriver.S3_PRESIGNED, FileDriver.S3].includes(fileDriver)) {
    const s3Url = (fileConfig() as FileConfig).s3Url;
    return `${s3Url}/${value}`;
  }

  return value;
}

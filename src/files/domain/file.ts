import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow } from 'class-validator';

import { AppConfig } from '@src/config/app-config.type';
import appConfig from '@src/config/app.config';
import { FileConfig, FileDriver } from '@src/files/config/file-config.type';
import fileConfig from '@src/files/config/file.config';
import awsConfig from '@src/config/aws.config';
import { AwsConfig } from '@src/config/aws-config.type';

export class File {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Allow()
  id: number;

  @ApiProperty({
    type: String,
    example: 'https://example.com/path/to/file.jpg',
  })
  @Transform(
    ({ value }) => {
      if ((fileConfig() as FileConfig).driver === FileDriver.LOCAL) {
        return (appConfig() as AppConfig).backendDomain + value;
      } else if (
        [FileDriver.S3_PRESIGNED, FileDriver.S3].includes(
          (fileConfig() as FileConfig).driver,
        )
      ) {
        const s3 = new S3Client({
          region: (fileConfig() as FileConfig).awsS3Region ?? '',
          credentials: {
            accessKeyId: (awsConfig() as AwsConfig).accessKeyId ?? '',
            secretAccessKey: (awsConfig() as AwsConfig).secretAccessKey ?? '',
          },
        });

        const command = new GetObjectCommand({
          Bucket: (fileConfig() as FileConfig).awsDefaultS3Bucket ?? '',
          Key: value,
        });

        return getSignedUrl(s3, command, { expiresIn: 3600 });
      }

      return value;
    },
    {
      toPlainOnly: true,
    },
  )
  path: string;
}

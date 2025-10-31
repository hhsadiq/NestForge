import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.

import { TABLES } from '@src/common/constants';
import { AppConfig } from '@src/config/app-config.type';
import appConfig from '@src/config/app.config';
import { AwsConfig } from '@src/config/aws-config.type';
import awsConfig from '@src/config/aws.config';
import { FileConfig, FileDriver } from '@src/files/config/file-config.type';
import fileConfig from '@src/files/config/file.config';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({ name: TABLES.file })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
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

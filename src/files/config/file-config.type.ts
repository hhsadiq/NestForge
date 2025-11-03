export enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
  S3_PRESIGNED = 's3-presigned',
}

export type FileConfig = {
  driver: FileDriver;
  awsDefaultS3Bucket?: string;
  awsS3Region?: string;
  maxFileSize: number;
  defaultS3Folder?: string;
  s3Url: string;
};

import S3 from 'aws-sdk/clients/s3';
import { R2Config } from '../types';

export const getS3Instance = (config: R2Config) => {
  return new S3({
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    accessKeyId: `${config.accessKey}`,
    secretAccessKey: `${config.secretAccessKey}`,
  });
};

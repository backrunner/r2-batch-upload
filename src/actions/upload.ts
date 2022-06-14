import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { R2Config } from '../types';
import { collectFiles, getLastPartFileName } from '../utils/files';
import { getS3Instance } from '../utils/s3';
import { getMD5OfFile } from '../utils/hash';

const FILTERED_FILES = ['./.r2-upload-config.json'];

export const doUpload = async (runDir: string, config: R2Config) => {
  const s3 = getS3Instance(config);
  const files = (await collectFiles(runDir)).filter((file) => !FILTERED_FILES.includes(file));
  if (!files?.length) {
    throw new Error('No files to upload.');
  }
  await Promise.allSettled(
    files.map(async (file) => {
      const absoluteFilePath = path.resolve(runDir, file);
      const fileKey = config.flat ? getLastPartFileName(file) : file.replace(/^\.[\//]/, '');
      const fileMd5 = await getMD5OfFile(absoluteFilePath);
      try {
        await s3
          .putObject({
            Bucket: config.bucket,
            Key: fileKey,
            Body: fs.createReadStream(absoluteFilePath),
            ContentMD5: fileMd5,
          })
          .promise();
        console.log(chalk.green(`${file} => ${config.bucket}:${fileKey}    ✅`));
      } catch (err) {
        console.error(chalk.red(`${file} => ${config.bucket}:${fileKey}    ❌`));
        console.error(chalk.red(err));
      }
    }),
  );
};

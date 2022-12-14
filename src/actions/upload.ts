import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { FileLog, R2Config } from '../types';
import { collectFiles, getFileKey, getLastPartFileName } from '../utils/files';
import { getS3Instance } from '../utils/s3';
import { getMD5OfFile } from '../utils/hash';
import { delay } from '../utils/delay';

const FILTERED_FILES = ['./.r2-upload-config.json'];

const BATCH_SIZE = Number(process.env.BATCH_SIZE || 10);
const UPLOAD_DELAY = Number(process.env.UPLOAD_DELAY || 500);

export const doUpload = async (baseDir: string, toUploadFiles: string[], config: R2Config, limit?: string) => {
  const s3 = getS3Instance(config);
  let files = (toUploadFiles || (await collectFiles(baseDir))).filter((file) => !FILTERED_FILES.includes(file));
  if (!files?.length) {
    throw new Error('No files to upload.');
  }
  if (limit) {
    files = files.slice(0, Number(limit));
  }
  const failed: FileLog[] = [];
  const succeed: FileLog[] = [];
  let successCounter = 0;
  await Promise.all(
    files.map(async (file, index) => {
      if (index + 1 >= BATCH_SIZE) {
        const delayTime = Math.floor((index + 1) / BATCH_SIZE) * UPLOAD_DELAY;
        await delay(delayTime);
      }
      const absoluteFilePath = path.resolve(baseDir, file);
      const fileKey = getFileKey(
        config.targetPrefix,
        config.flat ? getLastPartFileName(file) : file.replace(/^\.[\//]/, ''),
      );
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
        successCounter++;
        succeed.push({ relativePath: file, key: fileKey, md5: fileMd5 });
        console.log(chalk.green(`${file} => ${config.bucket}:${fileKey}    ✅  (${successCounter}/${files.length})`));
      } catch (err) {
        console.error(chalk.red(`${file} => ${config.bucket}:${fileKey}    ❌`));
        console.error(chalk.red(err));
        failed.push({ relativePath: file });
      }
    }),
  );
  return {
    succeed,
    failed,
  };
};

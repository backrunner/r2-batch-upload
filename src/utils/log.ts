import fs from 'fs';
import path from 'path';
import { UploadLogContent } from '../types';

export const writeUploadLog = (payload: UploadLogContent, customName = '') => {
  const logName = `${customName || 'upload_log'}-${Date.now()}.json`;
  fs.writeFileSync(path.resolve(process.cwd(), logName), JSON.stringify(payload, null, '  '), {
    encoding: 'utf-8',
  });
};

export const readUploadLog = (logPath: string) => {
  if (!fs.existsSync(logPath)) {
    throw new Error('Could not locate the upload log.');
  }
  return JSON.parse(fs.readFileSync(logPath, 'utf-8')) as UploadLogContent;
};

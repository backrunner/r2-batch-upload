import path from 'path';
import fs from 'fs';
import { R2Config } from '../types';

const BASE_CONFIG_FILE_NAME = '.r2-upload-config.json';

export const checkAndGetConfig = (configPath?: string) => {
  let targetPath;
  if (!configPath) {
    targetPath = path.resolve(process.cwd(), BASE_CONFIG_FILE_NAME);
  } else {
    targetPath = path.resolve(configPath);
  }
  if (!fs.existsSync(targetPath)) {
    throw new Error('Cannot find the config file.');
  }
  return JSON.parse(fs.readFileSync(targetPath, { encoding: 'utf-8' })) as R2Config;
};

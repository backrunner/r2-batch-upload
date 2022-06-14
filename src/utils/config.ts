import path from 'path';
import fs from 'fs';

export const checkAndGetConfig = (runDir: string) => {
  const configPath = path.resolve(runDir, './.r2-upload-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Cannot find the config file in the current folder.');
  }
  return JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }));
};

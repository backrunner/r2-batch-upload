import commander from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { name, version } from './package.json';
import { ERRORS } from './src/constants/errors';
import { checkAndGetConfig } from './src/utils/config';
import { collectFiles } from './src/utils/files';
import { doUpload } from './src/actions/upload';

const program = new commander.Command();

program.name(name);
program.version(version);

program.argument('[folder]', 'the folder to upload').action(async (folder?: string) => {
  let baseFolderPath;
  if (!folder) {
    baseFolderPath = process.cwd();
  } else if (folder.startsWith('/') || folder.includes(':/')) {
    baseFolderPath = path.resolve(folder);
  } else {
    baseFolderPath = path.resolve(process.cwd(), folder);
  }

  // check folder
  if (!fs.existsSync(baseFolderPath)) {
    console.error(chalk.red('Cannot access the folder, please check if the path you have inputed was correct.'));
    return process.exit(ERRORS.INVALID_BASE_FOLDER);
  }
  const baseFolderStat = fs.statSync(baseFolderPath);
  if (!baseFolderStat.isDirectory()) {
    console.error(chalk.red('The specified path is not a folder.'));
    return process.exit(ERRORS.INVALID_BASE_FOLDER);
  }

  // check config
  let r2Config;
  try {
    r2Config = checkAndGetConfig(baseFolderPath);
  } catch (err) {
    console.error(chalk.red((err as Error).message));
    return process.exit(ERRORS.GET_CONFIG_FAILED);
  }

  // get files
  let files;
  try {
    files = await collectFiles(baseFolderPath);
  } catch (err) {
    console.error(chalk.red((err as Error).message));
    return process.exit(ERRORS.GET_FILES_FAILED);
  }

  // upload files
  let failed;
  try {
    failed = (await doUpload(baseFolderPath, r2Config)).failed;
  } catch (err) {
    console.error(chalk.red((err as Error).message));
    return process.exit(ERRORS.GET_FILES_FAILED);
  }

  // finish
  if (!failed?.length) {
    console.log(chalk.green('Files have been uploaded to your Cloudflare R2 bucket :D'));
  } else {
    console.log(chalk.red('Ooops, some uploading actions failed.'));
  }
});

program.parse();

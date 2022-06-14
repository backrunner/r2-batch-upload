import path from 'path';
import fsp from 'fs/promises';

export const collectFiles = async (runDir: string, baseDir = '.') => {
  const res: string[] = [];
  const baseFolderPath = path.resolve(runDir, baseDir);
  const dirInfo = await fsp.readdir(baseFolderPath);
  await dirInfo.map(async (fileName) => {
    const filePath = path.resolve(baseFolderPath, fileName);
    const relativePath = `${baseDir}/${fileName}`;
    const stat = await fsp.stat(filePath);
    if (stat.isDirectory()) {
      res.push(...(await collectFiles(runDir, relativePath)));
    } else {
      res.push(relativePath);
    }
  });
  return res;
};

export const getLastPartFileName = (fileName: string) => {
  if (!fileName.includes('/')) {
    return fileName;
  }
  return fileName.slice(fileName.lastIndexOf('/') + 1);
};

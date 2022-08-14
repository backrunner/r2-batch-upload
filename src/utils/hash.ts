import crypto from 'crypto';
import fs from 'fs';

export const getMD5OfFile = (filePath: string) => {
  return new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash('MD5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => {
      hash.update(data);
    });
    stream.on('error', (err) => {
      reject(err);
    });
    stream.on('end', () => {
      resolve(hash.digest('base64'));
    });
  });
};

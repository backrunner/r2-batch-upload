export interface R2Config {
  bucket: string;
  accountId: string;
  accessKey: string;
  secretAccessKey: string;
  targetPrefix?: string;
  flat?: boolean;
}

export interface UploadOptions {
  config?: string;
  limit?: string;
}

export interface RetryOptions {
  config?: string;
  limit?: string;
}

export interface FileLog {
  md5?: string;
  key?: string;
  relativePath: string;
}

export interface UploadLogContent {
  bucket?: string;
  failed: FileLog[];
  succeed: FileLog[];
  baseFolderPath: string;
  originalLog?: string;
}

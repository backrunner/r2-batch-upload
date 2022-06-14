export interface R2Config {
  bucket: string;
  accountId: string;
  accessKey: string;
  secretAccessKey: string;
  targetPrefix?: string;
  flat?: boolean;
}

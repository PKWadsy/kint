// types.ts
export interface ExpressResponseWrapper {
  status?: number;
  statusMessage?: string;
  headers?: { [key: string]: string | string[] };
  cookies?: { [key: string]: unknown };
  clearCookies?: string[];
  data?: unknown;
  redirectUrl?: string;
  filePath?: string;
  fileDownloadName?: string;
  buffer?: Buffer;
  stream?: NodeJS.ReadableStream;
  responseType?: string;
}

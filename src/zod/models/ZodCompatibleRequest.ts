/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ZodCompatibleRequest {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  cookies?: any;
}

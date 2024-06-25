import { ValidationResult } from "./ValidationResult";

export type GenericValidatorMap<RequestType> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (request: RequestType) => ValidationResult<any>;
};

import { ValidationResult } from "./ValidationResult";

export type Validator<RequestType, Data> = (
  request: RequestType,
) => ValidationResult<Data>;

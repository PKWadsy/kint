import { ValidationFailure } from "./ValidationFailure";
import { ValidationSuccess } from "./ValidationSuccess";

export type ValidationResult<Data> =
  | ValidationSuccess<Data>
  | ValidationFailure;

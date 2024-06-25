import { ValidatedDataMap } from "./ValidatedDataMap";
import { GenericValidatorMap } from "./GenericValidatorMap";

export type WithValidatedData<
  Context,
  RequestType,
  Validators extends GenericValidatorMap<RequestType>,
> = Context & {
  valid: ValidatedDataMap<RequestType, Validators>;
};

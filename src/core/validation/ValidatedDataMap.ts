import { GenericValidatorMap } from "./GenericValidatorMap";
import { ExtractData } from "./ExtractData";

export type ValidatedDataMap<
  RequestType,
  Validators extends GenericValidatorMap<RequestType>,
> = {
  [ValidatorKey in keyof Validators]: ExtractData<Validators[ValidatorKey]>;
};

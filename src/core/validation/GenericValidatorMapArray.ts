import { GenericValidatorMap } from "./GenericValidatorMap";

export type GenericValidatorMapArray<RequestType> = readonly [
  ...GenericValidatorMap<RequestType>[],
];

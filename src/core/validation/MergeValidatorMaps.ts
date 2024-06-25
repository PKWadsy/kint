import { GenericValidatorMapArray } from "./GenericValidatorMapArray";

export type MergeValidatorMaps<
  RequestType,
  Validators extends GenericValidatorMapArray<RequestType>,
> = Validators extends [infer Head, ...infer Tail]
  ? Head &
      (Tail extends GenericValidatorMapArray<RequestType>
        ? MergeValidatorMaps<RequestType, Tail>
        : never)
  : {};

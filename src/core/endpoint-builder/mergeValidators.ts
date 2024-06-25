import { GenericValidatorMapArray } from "../validation/GenericValidatorMapArray";
import { MergeValidatorMaps } from "../validation/MergeValidatorMaps";

/**
 * Takes an array of objects where each key is a validator and merges them into a single object.
 * @param validators An array of objects where each key is a validator.
 * @returns A single object containing all the validators.
 */
export function mergeValidators<
  RequestType,
  Validators extends GenericValidatorMapArray<RequestType>,
>(validators: Validators): MergeValidatorMaps<RequestType, Validators> {
  return validators.reduce<MergeValidatorMaps<RequestType, Validators>>(
    (accumulator, validatorMap) => {
      return {
        ...accumulator,
        ...validatorMap,
      };
    },
    {} as MergeValidatorMaps<RequestType, Validators>,
  );
}

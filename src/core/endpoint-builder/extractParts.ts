import { ConfigurableHandler } from "../common/ConfigurableHandler";
import { DefineEndpointFunctionArgs } from "../common/DefineEndpointFunction";
import { BaseContext } from "../common/BaseContext";
import { GenericValidatorMapArray } from "../validation/GenericValidatorMapArray";
import { WithValidatedData } from "../validation/WithValid";
import { MergeValidatorMaps } from "../validation/MergeValidatorMaps";

/**
 * Takes an args array from the define endpoint function and extracts the config, validators, and handler from it in a type safe way.
 * @param args The args array to extract the parts from.
 * @returns An object containing the config, validators, and handler.
 */
export function extractParts<
  RequestType,
  ResponseType,
  Context extends BaseContext<GlobalContext>,
  GlobalContext,
  Config,
  DefaultConfig,
  Validators extends GenericValidatorMapArray<RequestType>,
>(
  ...args: DefineEndpointFunctionArgs<
    RequestType,
    ResponseType,
    Context,
    GlobalContext,
    Config,
    DefaultConfig,
    Validators
  >
): {
  config: Config;
  validators: Validators;
  handler: ConfigurableHandler<
    RequestType,
    ResponseType,
    WithValidatedData<
      BaseContext<GlobalContext>,
      RequestType,
      MergeValidatorMaps<RequestType, Validators>
    >,
    Config
  >;
} {
  return {
    config: args[0] as Config,
    validators: args.slice(1, -1) as unknown as Validators,
    handler: args[args.length - 1] as ConfigurableHandler<
      RequestType,
      ResponseType,
      WithValidatedData<
        BaseContext<GlobalContext>,
        RequestType,
        MergeValidatorMaps<RequestType, Validators>
      >,
      Config
    >,
  };
}

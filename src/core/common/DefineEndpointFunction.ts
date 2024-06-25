import { RequireMissingOnDefault } from "../../utils/types/RequireMissingOnDefault";
import { ConfigurableHandler } from "./ConfigurableHandler";
import { BaseContext } from "./BaseContext";
import { WithValidatedData } from "../validation/WithValid";
import { GenericValidatorMapArray } from "../validation/GenericValidatorMapArray";
import { MergeValidatorMaps } from "../validation/MergeValidatorMaps";

export type DefineEndpointFunctionArgs<
  RequestType,
  ResponseType,
  Context extends BaseContext<GlobalContext>,
  GlobalContext,
  Config,
  DefaultConfig,
  Validators extends GenericValidatorMapArray<RequestType>,
> = readonly [
  config: RequireMissingOnDefault<Config, DefaultConfig>,
  ...validators: Validators,
  handler: ConfigurableHandler<
    RequestType,
    ResponseType,
    WithValidatedData<
      Context,
      RequestType,
      MergeValidatorMaps<RequestType, Validators>
    >,
    Config
  >,
];

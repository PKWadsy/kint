import { ConfigurableHandler } from "../../common/ConfigurableHandler";
import { HandlerBuilder } from "./HandlerBuilder";

type EmptyObject = {};

/**
 * The base handler builder is a handler builder that does not wrap the inner handler with any additional functionality. It simply passes it through.
 */
export class BaseHandlerBuilder<
  RequestType,
  ResponseType,
  Config extends object,
> implements
    HandlerBuilder<RequestType, ResponseType, EmptyObject, EmptyObject, Config>
{
  buildWrappedHandler<InputContext extends object, InputConfig extends object>(
    innerHandler: ConfigurableHandler<
      RequestType,
      ResponseType,
      InputContext,
      InputConfig & Config
    >,
  ): ConfigurableHandler<
    RequestType,
    ResponseType,
    InputContext,
    Config & InputConfig
  > {
    return innerHandler;
  }
}

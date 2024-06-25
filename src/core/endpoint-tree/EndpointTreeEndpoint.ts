import { BaseContext } from "../common/BaseContext";
import { Handler } from "../common/Handler";
import { Method } from "../common/Method";

/**
 * Represents an endpoint in the endpoint tree. An endpoint is a handler which is associated with a specific path and method.
 */
export type EndpointTreeEndpoint<
  RequestType,
  ResponseType,
  GlobalContext,
  Config,
> = {
  handler: Handler<RequestType, ResponseType, BaseContext<GlobalContext>>;
  config: Config;
  method: Method;
};

import { BaseContext } from "../common/BaseContext";
import { Handler } from "../common/Handler";

/**
 * A DuvetEndpoint is a representation of a single endpoint under the Duvet framework.
 * It contains a handler which will be called when the endpoint is hit, and a config object which is passed into the handler.
 * The config object is used to configure the handler which may contain many layers of middleware.
 * @template RequestType The type of the request object which is passed into the handler.
 * @template ResponseType The type of the response object which is returned by the handler.
 * @template GlobalContext The type of the global context object which is passed into the handler.
 * @template Config The type of the config object which is passed into the handler.
 */
export type DuvetEndpoint<RequestType, ResponseType, GlobalContext, Config> = {
  exportType: "DuvetEndpoint";
  handler: Handler<RequestType, ResponseType, BaseContext<GlobalContext>>;
  config: Config;
};

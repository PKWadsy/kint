import { buildMiddleware } from "../core/buildMiddleware";
import {
  ExpressMiddleware,
  ExpressMiddlewareHandler,
} from "./models/ExpressMiddleware";

/**
 * Builds a middleware object.
 * @param name The name of the middleware.
 * @param handler The handler that wraps the middleware.
 * @returns A middleware object.
 */
export function buildExpressMiddleware<
  Name extends string,
  Config = void,
  Context = void,
  GlobalContext = void,
>(
  name: Name,
  handler: ExpressMiddlewareHandler<Config, Context, GlobalContext>,
): ExpressMiddleware<Name, Config, Context, GlobalContext> {
  return buildMiddleware(name, handler);
}

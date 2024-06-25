/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware, MiddlewareHandler } from "src/core/common/Middleware";
import { MaybeAsync } from "src/utils/types/MaybeAsync";

// eslint-disable-next-line jsdoc/require-jsdoc
export function buildTestMiddleware<
  Name extends string,
  Context,
  Config,
  GlobalContext = unknown,
>(
  name: Name,
  before: (
    config: Config,
    globalContext: GlobalContext,
  ) => Context | null = () => null,
  after: (response: any) => MaybeAsync<any> = (response) => response,
): Middleware<any, any, Name, Config, Context | null, GlobalContext> {
  const middlewareHandler: MiddlewareHandler<
    any,
    any,
    Config,
    Context | null,
    GlobalContext
  > = async ({ config, global }, next): Promise<any> => {
    const contextExt = await before(config, global);
    const result = await next(contextExt);
    return await after(result);
  };

  return {
    name,
    handler: middlewareHandler,
  };
}

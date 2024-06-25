import { MaybeAsync } from "../../../utils/types/MaybeAsync";
import { BaseContext } from "../../common/BaseContext";
import { ConfigurableHandler } from "../../common/ConfigurableHandler";
import { Middleware } from "../../common/Middleware";
import { HandlerBuilder } from "./HandlerBuilder";

/**
 * The middleware handler takes an inner handler and uses to create a new handler in two steps:
 *
 * Firstly, it uses another handler builder to create a new, wrapped inner handler.
 * Then it creates a new handler which runs the passed in middleware, using the previously created wrapped inner handler as the next function for that middleware.
 * @template MiddlewareName The name of the middleware.
 * @template GlobalContext The global context which is passed into the outer handler. This is then propagated through all the middleware to the inner handler. It is also passed into each middleware.
 * @template InnerHandlerContext The full context object which wrapped handler expects. This is passed into the wrapped inner handler from the previous wrapper.
 * @template ContextExtension The extension to the context which the middleware adds.
 * @template InnerHandlerConfig The configuration object which the inner handler expects.
 * @template ConfigExtension The extension to the configuration object which the middleware adds.
 */
export class MiddlewareHandlerBuilder<
  RequestType,
  ResponseType,
  MiddlewareName extends string,
  GlobalContext, // Represents the base context which is passed into the outer handler
  InnerHandlerContext extends BaseContext<GlobalContext>, // Represents the full context which is passed to the inner handler from the previous wrapper.
  ContextExtension,
  InnerHandlerConfig extends object,
  ConfigExtension,
> implements
    HandlerBuilder<
      RequestType,
      ResponseType,
      BaseContext<GlobalContext>,
      InnerHandlerContext & Record<MiddlewareName, ContextExtension>,
      InnerHandlerConfig & Record<MiddlewareName, ConfigExtension>
    >
{
  /**
   * This is the handler builder which is used to wrap the inner handler before the middleware is applied.
   */
  private innerHandlerBuilder: HandlerBuilder<
    RequestType,
    ResponseType,
    BaseContext<GlobalContext>,
    InnerHandlerContext,
    InnerHandlerConfig
  >;

  /**
   * The middleware which is takes the wrapped inner handler as a next function.
   */
  private middleware: Middleware<
    RequestType,
    ResponseType,
    MiddlewareName,
    ConfigExtension,
    ContextExtension,
    GlobalContext
  >;

  /**
   * Creates a new middleware handler builder.
   * @param innerHandlerBuilder A handler builder which is used to wrap the innermost handler before the middleware is applied.
   * @param middleware The middleware which is applied to the wrapped inner handler.
   */
  constructor(
    innerHandlerBuilder: HandlerBuilder<
      RequestType,
      ResponseType,
      BaseContext<GlobalContext>,
      InnerHandlerContext,
      InnerHandlerConfig
    >,
    middleware: Middleware<
      RequestType,
      ResponseType,
      MiddlewareName,
      ConfigExtension,
      ContextExtension,
      GlobalContext
    >,
  ) {
    this.innerHandlerBuilder = innerHandlerBuilder;
    this.middleware = middleware;
  }

  /**
   * Extends some context object with the context extension produced by the middleware.
   * @param context The context object to extend.
   * @param key The key to extend the context with.
   * @param ext The extension value added to existing context.
   * @returns The context with the extension added.
   */
  private extendContext<InputContext extends object>(
    context: BaseContext<GlobalContext> & InputContext,
    key: MiddlewareName,
    ext: ContextExtension,
  ): BaseContext<GlobalContext> &
    InputContext &
    Record<MiddlewareName, ContextExtension> {
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    (context as Record<MiddlewareName, ContextExtension>)[key] = ext;
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    return context as BaseContext<GlobalContext> &
      Record<MiddlewareName, ContextExtension> &
      InputContext;
  }

  /**
   * Creates a next function from an inner handler. The inner handler is first wrapped using the inner handler builder.
   * The next function takes in some context object. The existing context object is then extended with this context object.
   * Finally, we run the wrapped inner handler with this extended context object.
   * @param request The request object which is passed into the inner handler.
   * @param inputContext The context which is passed in from the outer handler.
   * @param config The configuration object which is passed in from the outer handler and propagated through to the inner handler.
   * @param innerHandler The inner handler which is wrapped by all the middleware
   * @template InputContext The context object which is passed into the inner handler.
   * @returns A function which takes in a context object and runs the inner handler with the extended context object.
   */
  private createNextFunction<
    InputContext extends object,
    InputConfig extends object,
  >(
    request: RequestType,
    inputContext: BaseContext<GlobalContext> & InputContext,
    config: InputConfig & // Config object expected by middlewares which wrap this one.
      InnerHandlerConfig & // Config object expected by all inner handlers
      Record<MiddlewareName, ConfigExtension>, // Middleware config
    innerHandler: ConfigurableHandler<
      RequestType,
      ResponseType,
      InputContext &
        InnerHandlerContext &
        Record<MiddlewareName, ContextExtension>,
      InputConfig & InnerHandlerConfig & Record<MiddlewareName, ConfigExtension>
    >,
  ): (valueToExtendContextWith: ContextExtension) => MaybeAsync<ResponseType> {
    const wrappedInnerHandler = this.innerHandlerBuilder.buildWrappedHandler<
      InputContext & Record<MiddlewareName, ContextExtension>,
      InputConfig & Record<MiddlewareName, ConfigExtension>
    >(innerHandler);

    return async (context: ContextExtension) => {
      const extendedContext = this.extendContext<InputContext>(
        inputContext,
        this.middleware.name,
        context,
      );

      return await wrappedInnerHandler(request, extendedContext, config);
    };
  }

  /**
   * Takes in an inner handler and wraps it with all the middleware below this one (using the inner handler builder), and then wraps it with the middleware of this builder. It then returns the new handler.
   * @param innerHandler The handler that this builder will wrap with middleware.
   * @returns A new handler which passes the inner handler into it.
   */
  buildWrappedHandler<InputContext extends object, InputConfig extends object>(
    innerHandler: ConfigurableHandler<
      RequestType,
      ResponseType,
      BaseContext<GlobalContext> &
        InnerHandlerContext &
        InputContext &
        Record<MiddlewareName, ContextExtension>,
      InnerHandlerConfig & InputConfig & Record<MiddlewareName, ConfigExtension>
    >,
  ): ConfigurableHandler<
    RequestType,
    ResponseType,
    BaseContext<GlobalContext> & InputContext,
    InnerHandlerConfig & InputConfig & Record<MiddlewareName, ConfigExtension>
  > {
    const newHandler: ConfigurableHandler<
      RequestType,
      ResponseType,
      BaseContext<GlobalContext> & InputContext,
      InnerHandlerConfig & InputConfig & Record<MiddlewareName, ConfigExtension>
    > = async (request, inputContext, config) => {
      const next = this.createNextFunction<InputContext, InputConfig>(
        request,
        inputContext,
        config,
        innerHandler,
      );

      return await this.middleware.handler(
        {
          config: config[this.middleware.name],
          global: inputContext.global,
          request,
        },
        next,
      );
    };

    return newHandler;
  }
}

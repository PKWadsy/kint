import { ConfigurableHandler } from "../../common/ConfigurableHandler";

/**
 * A handler builder is anything which takes in an inner handler and returns some new handler which wraps the inner handler.
 * The wrapped handler takes in some config object and passes it through to the inner handler. The wrapped handler can also extend
 * the context object. This means that the type of the context which is passed into the inner handler is the same as the type of the context
 * which is passed into the wrapped handler, but with some added fields.
 * @template BaseContext The base context object which is passed into the outer handler and propagated through to the innermost handler context
 * @template AddedContext The context which is added to the inner handler context by the handler builder.
 * @template Config The configuration object which is passed into handler produced by the `buildWrappedHandler` function and propagated through to the inner handler.
 */
export interface HandlerBuilder<
  RequestType,
  ResponseType,
  BaseContext extends object,
  AddedContext extends BaseContext,
  Config extends object,
> {
  /**
   * The build wrapped handler function takes an inner handler and returns a new handler.
   * The new handler will generally wrap the inner handler in some way.
   * @param innerHandler Some handler which will be wrapped. The context type of the inner handler is the same as the context type of the output handler, but with some added fields defined in the `AddedContext` type parameter.
   * @template InputContext Some context type which is passed into the produced handler and propagated to the inner handler.
   * @template InputConfig Some configuration type which is passed into the produced handler and propagated to the inner handler.
   * @returns A new handler which wraps the inner handler. The context type of the output handler is the same as the context type of the inner handler, but without the added fields defined in the `AddedContext` type parameter.
   */
  buildWrappedHandler<InputContext extends object, InputConfig extends object>(
    innerHandler: ConfigurableHandler<
      RequestType,
      ResponseType,
      InputContext & AddedContext & BaseContext,
      InputConfig & Config
    >,
  ): ConfigurableHandler<
    RequestType,
    ResponseType,
    InputContext & BaseContext,
    InputConfig & Config
  >;
}

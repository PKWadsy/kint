import { mergeDefaultWithMissingItems } from "../../utils/mergeDefaultWithMissingItems";
import { extendObject } from "../../utils/extendObject";
import { DuvetExport } from "../common/DuvetExport";
import { Middleware } from "../common/Middleware";
import { getFromFnOrValue } from "../../utils/getFromFnOrValue";
import { DuvetEndpoint } from "./DuvetEndpoint";
import { NotKeyOf } from "../../utils/types/NotKeyOf";
import { DefineEndpointFunctionArgs } from "../common/DefineEndpointFunction";
import { extractParts } from "./extractParts";
import { wrapHandlerWithValidationLayer } from "./handlerWithValidators";
import { HandlerBuilder } from "./handler-builder/HandlerBuilder";
import { MiddlewareHandlerBuilder } from "./handler-builder/MiddlewareHandlerBuilder";
import { BaseHandlerBuilder } from "./handler-builder/BaseHandlerBuilder";
import { EmptyObject } from "../common/EmptyObject";
import { BaseContext } from "../common/BaseContext";
import { GenericValidatorMapArray } from "../validation/GenericValidatorMapArray";
import { mergeValidators } from "./mergeValidators";

/**
 * The main class that is used to define endpoints and build a router
 */
export class DuvetEndpointBuilder<
  RequestType,
  ResponseType,
  Context extends PreviousContext,
  Config extends object,
  DefaultConfig,
  GlobalContext,
  PreviousContext extends BaseContext<GlobalContext>,
> {
  /**
   * Creates a new DuvetEndpointBuilder object. This is the starting point for defining endpoints.
   * @returns A new DuvetEndpointBuilder instance with a global context object.
   */
  public static new<GlobalContext, RequestType, ResponseType>() {
    type Context = {
      global: GlobalContext;
    };

    return new DuvetEndpointBuilder<
      RequestType,
      ResponseType,
      Context,
      EmptyObject,
      EmptyObject,
      GlobalContext,
      BaseContext<GlobalContext>
    >({}, new BaseHandlerBuilder());
  }

  private defaultConfig: DefaultConfig;

  /**
   * Builds a new handler with all the previous middleware applied to it.
   */
  private handlerBuilder: HandlerBuilder<
    RequestType,
    ResponseType,
    BaseContext<GlobalContext>,
    PreviousContext,
    Config
  >;

  private constructor(
    defaultConfig: DefaultConfig,
    handlerBuilder: HandlerBuilder<
      RequestType,
      ResponseType,
      BaseContext<GlobalContext>,
      PreviousContext,
      Config
    >,
  ) {
    this.defaultConfig = defaultConfig;
    this.handlerBuilder = handlerBuilder;
  }

  /**
   * Extends the default config object. Takes a partial object to extend the default config object with.
   * @param extension A partial object to extend the default config object with.
   * @returns A new DuvetEndpointBuilder instance with the new default config object.
   */
  extendConfig<DefaultConfigExtension extends Partial<Config>>(
    extension: DefaultConfigExtension,
  ) {
    return new DuvetEndpointBuilder<
      RequestType,
      ResponseType,
      Context,
      Config,
      DefaultConfig & DefaultConfigExtension,
      GlobalContext,
      PreviousContext
    >(extendObject(this.defaultConfig, extension), this.handlerBuilder);
  }

  /**
   * Creates a new DuvetEndpointBuilder with the middleware added.
   * @param middleware The middleware to extend the DuvetEndpointBuilder instance with
   * @returns A new DuvetEndpointBuilder instance with the middleware added.
   */
  addMiddleware<Name extends string, ContextExt, ConfigExt>(
    middleware: Middleware<
      RequestType,
      ResponseType,
      NotKeyOf<Name, Config>,
      ConfigExt,
      ContextExt,
      GlobalContext
    >,
  ) {
    const newHandlerBuilder = new MiddlewareHandlerBuilder<
      RequestType,
      ResponseType,
      NotKeyOf<Name, Config>,
      GlobalContext,
      Context,
      ContextExt,
      Config,
      ConfigExt
    >(this.handlerBuilder, middleware);

    // Creates a new DuvetEndpointBuilder object with the new handler builder.
    return new DuvetEndpointBuilder<
      RequestType,
      ResponseType,
      Context & Record<Name, ContextExt>,
      Config & Record<Name, ConfigExt>,
      DefaultConfig,
      GlobalContext,
      Context
    >(this.defaultConfig, newHandlerBuilder);
  }

  /**
   * Overrides the config object with a new one. This can be a partial object or a function that takes the current config object and returns a new one.
   * @param newConfig A new config object or a function that takes the current config object and returns a new one.
   * @returns A new DuvetEndpointBuilder instance with the new config object.
   */
  setConfig<NewDefaultConfig extends Partial<Config>>(
    newConfig: ((config: DefaultConfig) => NewDefaultConfig) | NewDefaultConfig,
  ) {
    const resolvedNewConfig = getFromFnOrValue(newConfig, this.defaultConfig);

    return new DuvetEndpointBuilder<
      RequestType,
      ResponseType,
      Context,
      Config,
      NewDefaultConfig,
      GlobalContext,
      PreviousContext
    >(resolvedNewConfig, this.handlerBuilder);
  }

  defineEndpoint<Validators extends GenericValidatorMapArray<RequestType>>(
    ...args: DefineEndpointFunctionArgs<
      RequestType,
      ResponseType,
      Context,
      GlobalContext,
      Config,
      DefaultConfig,
      Validators
    >
  ): DuvetExport<
    DuvetEndpoint<RequestType, ResponseType, GlobalContext, Config>
  > {
    const { config, validators, handler } = extractParts<
      RequestType,
      ResponseType,
      Context,
      GlobalContext,
      Config,
      DefaultConfig,
      Validators
    >(...args);

    // Merges the config from the user with the default config.
    const mergedConfig = mergeDefaultWithMissingItems<Config, DefaultConfig>(
      this.defaultConfig,
      config,
    );

    const mergedValidators = mergeValidators<RequestType, Validators>(
      validators,
    );

    const handlerWithMiddleware = this.handlerBuilder.buildWrappedHandler(
      wrapHandlerWithValidationLayer(handler, mergedValidators),
    );

    return {
      builtByDuvet: true,
      data: {
        config: mergedConfig,
        handler: (request, context) =>
          handlerWithMiddleware(request, context, mergedConfig),
        exportType: "DuvetEndpoint",
      },
    };
  }
}

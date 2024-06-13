import { KintRequest } from "./models/KintRequest";
import { mergeDefaultWithMissingItems } from "../utils/mergeConfigs";
import { extendObject } from "../utils/extendConfig";
import { KintExport } from "./models/KintExport";
import { RequireMissingOnDefault } from "../utils/requireFromDefault";
import { Middleware } from "./models/Middleware";
import { getFromFnOrValue } from "../utils/getFromFnOrValue";
import { KintEndpointMeta } from "./models/KintEndpointMeta";
import { HandlerBuilder } from "./models/HandlerBuilder";
import { Handler } from "./models/Handler";
import { Extend } from "../utils/types/Extend";
import { NotKeyOf } from "../utils/types/NotKeyOf";
import { extractHandler } from "./extractHandler";
import { WithValid } from "./models/WithValid";
import { Validator } from "./models/Validator";

/**
 * The main class that is used to define endpoints and build a router
 * .
 * TODO: Add more information and examples on how to use the class
 */
export class Kint<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Context extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Config extends Record<string, any>,
  DefaultConfig extends Partial<Config> = Config
> {
  /**
   * Creates a new Kint object. This is the starting point for defining endpoints.
   *
   * TODO: Add more information and examples on how to use the class
   *
   * @returns A new Kint instance with a global context object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static new<GlobalContext>() {
    type Context = {
      global: GlobalContext;
    };

    type Config = Record<string, never>;

    return new Kint<Context, Config>(
      {},
      {
        buildHandler: <FullContext extends Context, FullConfig extends Config>(
          innerHandler: Handler<FullContext, FullConfig>
        ) => innerHandler,
      }
    );
  }

  private defaultConfig: DefaultConfig;

  /**
   * Builds a new handler with all the previous middleware applied to it.
   */
  private handlerBuilder: HandlerBuilder<Context, Config>;

  private constructor(
    defaultConfig: DefaultConfig,
    handlerBuilder: HandlerBuilder<Context, Config>
  ) {
    this.defaultConfig = defaultConfig;
    this.handlerBuilder = handlerBuilder;
  }

  /**
   * Extends the default config object. Takes a partial object to extend the default config object with.
   *
   * @param extension A partial object to extend the default config object with.
   * @returns A new Kint instance with the new default config object.
   */
  extendConfig<DefaultConfigExtension extends Partial<Config>>(
    extension: DefaultConfigExtension
  ) {
    return new Kint<Context, Config, DefaultConfig & DefaultConfigExtension>(
      extendObject(this.defaultConfig, extension),
      this.handlerBuilder
    );
  }

  /**
   *
   * @param middleware
   * @returns
   */
  addMiddleware<Name extends string, ContextExt, ConfigExt>(
    middleware: Middleware<NotKeyOf<Name, Config>, ContextExt, ConfigExt>
  ) {
    // Create a new handler builder which wraps the

    /**
     *
     * @param innermostHandler The handler that this middleware will wrap.
     * @returns A new handler which passes the inner handler into it.
     */

    const newHandlerBuilder: HandlerBuilder<
      Extend<Context, ContextExt, Name>,
      Extend<Config, ConfigExt, Name>
    > = {
      buildHandler: <
        FullContext extends Extend<Context, ContextExt, Name>,
        FullConfig extends Extend<Config, ConfigExt, Name>
      >(
        innermostHandler: Handler<
          Extend<Context, ContextExt, Name>,
          Extend<Config, ConfigExt, Name>
        >
      ) => {
        // Builds a handler using the previous handler builder to wrap the innermost handler.
        const wrappedInnerHandler = this.handlerBuilder.buildHandler<
          FullContext,
          FullConfig
        >(innermostHandler);

        // Returns a new handler that wraps the handler generated by the previous handler builder.
        return (
          request: KintRequest,
          context: FullContext,
          config: FullConfig
        ) =>
          middleware.handler(
            request,
            config[middleware.name],

            // Next function simply extends the context object with the extension object and calls the inner handler.
            (extension: ContextExt) => {
              (context as Record<Name, ContextExt>)[middleware.name] =
                extension;
              return wrappedInnerHandler(request, context, config);
            }
          );
      },
    };

    // Creates a new kint object with the new handler builder.
    return new Kint<
      Extend<Context, ContextExt, Name>,
      Extend<Config, ConfigExt, Name>,
      DefaultConfig
    >(this.defaultConfig, newHandlerBuilder);
  }

  /**
   * Overrides the config object with a new one. This can be a partial object or a function that takes the current config object and returns a new one.
   *
   * @param newConfig A new config object or a function that takes the current config object and returns a new one.
   * @returns A new Kint instance with the new config object.
   */
  setConfig<NewDefaultConfig extends Partial<Config>>(
    newConfig: ((config: DefaultConfig) => NewDefaultConfig) | NewDefaultConfig
  ) {
    const resolvedNewConfig = getFromFnOrValue(newConfig, this.defaultConfig);

    return new Kint<Context, Config, NewDefaultConfig>(
      resolvedNewConfig,
      this.handlerBuilder
    );
  }

  /**
   * This function is used to define a new endpoint.
   *
   * @param config A configuration object to configure any middleware.
   * @param handler A handler function that will be called when this endpoint is hit.
   * @returns And endpoint definition which can be used by Kint to build a router.
   */
  defineEndpoint<Body, Params>(
    config: RequireMissingOnDefault<Config, DefaultConfig>,
    validator: Validator<Body, Params>,
    handler: Handler<WithValid<Context, Body, Params>, Config>
  ): KintExport<KintEndpointMeta> {
    // Merges the config from the user with the default config.
    const mergedConfig = mergeDefaultWithMissingItems(
      this.defaultConfig,
      config
    );

    const handlerWithMiddleware = this.handlerBuilder.buildHandler(
      extractHandler([validator, handler])
    );

    return {
      builtByKint: true,
      data: {
        config: mergedConfig,
        handler: handlerWithMiddleware,
        data: "KintEndpointMeta",
      },
    };
  }
}

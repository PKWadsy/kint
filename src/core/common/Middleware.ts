import { MaybeAsync } from "../../utils/types/MaybeAsync";

export type MiddlewareHandler<
  RequestType,
  ResponseType,
  ConfigExtension,
  ContextExtension,
  GlobalContext = unknown,
> = (
  context: {
    request: RequestType;
    config: ConfigExtension;
    global: GlobalContext;
  },
  next: (ext: ContextExtension) => MaybeAsync<ResponseType>,
) => MaybeAsync<ResponseType>;

export type Middleware<
  RequestType,
  ResponseType,
  Name extends string,
  ConfigExtension = void,
  ContextExtension = void,
  GlobalContext = unknown,
> = {
  handler: MiddlewareHandler<
    RequestType,
    ResponseType,
    ConfigExtension,
    ContextExtension,
    GlobalContext
  >;
  name: Name;
};

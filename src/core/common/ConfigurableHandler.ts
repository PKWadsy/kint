import { MaybeAsync } from "../../utils/types/MaybeAsync";

export type ConfigurableHandler<RequestType, ResponseType, Context, Config> = (
  request: RequestType,
  context: Context,
  config: Config,
) => MaybeAsync<ResponseType>;

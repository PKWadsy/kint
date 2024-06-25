import { MaybeAsync } from "../../utils/types/MaybeAsync";

export type Handler<RequestType, ResponseType, Context> = (
  request: RequestType,
  context: Context,
) => MaybeAsync<ResponseType>;

import { Conflict } from "./Conflict";
import { NoConflict } from "./NoConflict";

export type ConflictResult<RequestType, ResponseType, Context, PluginConfig> =
  | Conflict<RequestType, ResponseType, Context, PluginConfig>
  | NoConflict;

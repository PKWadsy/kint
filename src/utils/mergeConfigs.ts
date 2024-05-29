import { RequireMissingOnDefault } from "./requireFromDefault";

export function mergeDefaultWithMissingItems<
  Config,
  Default extends Partial<Config>
>(
  incomplete: Default,
  remaining: RequireMissingOnDefault<Config, Default>
): Config {
  return {
    ...incomplete,
    ...remaining,
  } as Config;
}
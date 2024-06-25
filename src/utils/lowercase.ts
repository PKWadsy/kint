/**
 * Converts a string to lowercase in a type safe way.
 * @param toMakeLower The string to make lowercase.
 * @returns The string in lowercase.
 */
export function lowercase<const ToLower extends string>(
  toMakeLower: ToLower,
): Lowercase<ToLower> {
  // eslint-disable-next-line no-type-assertion/no-type-assertion -- We know that the output will match this type.
  return toMakeLower.toLowerCase() as Lowercase<ToLower>;
}

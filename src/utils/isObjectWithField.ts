/**
 *  Check if an object is an object with a specific field
 * @param object The object to check
 * @param field The field to check exists on the object
 * @returns A boolean indicating if the object is an object with the specified field
 */
export function isObjectWithField<Field extends string>(
  object: unknown,
  field: Field,
): object is {
  [key in Field]: unknown;
} {
  if (typeof object !== "object" || object == null) return false;
  return field in object;
}

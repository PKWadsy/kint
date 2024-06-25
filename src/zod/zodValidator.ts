import { Validator } from "../core/validation/Validator";
import { zodRequestFieldValidator } from "./zodRequestFieldValidator";
import { ZodValidatorMap } from "./ZodValidatorMap";
import { GenericZodSchemaMap } from "./models/GenericZodSchemaMap";
import { ZodCompatibleRequest } from "./models/ZodCompatibleRequest";

/**
 * Creates an array of validators for the request data using Zod schemas.
 * @param validator - The Zod schema to use to validate the request.
 *
 * Supported fields:
 * @param validator.body - Body schema
 * @param validator.params - Params schema
 * @param validator.query - Query schema
 * @param validator.headers - Headers schema
 * @param validator.cookies - Cookies schema
 * @returns A new duvet validator array
 */
export function zodValidator<ZodSchemaMap extends GenericZodSchemaMap>(
  validator: ZodSchemaMap,
): ZodValidatorMap<ZodSchemaMap> {
  const validators: {
    [key: string]: Validator<ZodCompatibleRequest, unknown>;
  } = {};

  if (validator.body) {
    validators["body"] = zodRequestFieldValidator("body", validator.body);
  }
  if (validator.params) {
    validators["params"] = zodRequestFieldValidator("params", validator.params);
  }
  if (validator.query) {
    validators["query"] = zodRequestFieldValidator("query", validator.query);
  }
  if (validator.headers) {
    validators["headers"] = zodRequestFieldValidator(
      "headers",
      validator.headers,
    );
  }
  if (validator.cookies) {
    validators["cookies"] = zodRequestFieldValidator(
      "cookies",
      validator.cookies,
    );
  }

  return validators as ZodValidatorMap<ZodSchemaMap>;
}

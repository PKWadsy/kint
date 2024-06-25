import { ZodTypeAny, output } from "zod";
import { Validator } from "../core/validation/Validator";
import { formatZodError } from "./formatZodError";
import { RequestFields } from "./models/RequestFields";
import { ZodCompatibleRequest } from "./models/ZodCompatibleRequest";

/**
 * Validates a specific field in a request using a Zod schema.
 * @template Field - The type of field to validate (e.g., "body", "params", "query").
 * @template ZodSchema - The Zod schema to use for validation.
 * @param field - The field to validate.
 * @param schema - The Zod schema to use for validation. If not provided, the field will be considered valid.
 * @returns The validation result.
 */
export function zodRequestFieldValidator<
  Field extends RequestFields,
  ZodSchema extends ZodTypeAny,
  Request extends ZodCompatibleRequest,
>(field: Field, schema: ZodSchema): Validator<Request, output<ZodSchema>> {
  return (request: Request) => {
    const result = schema.safeParse(request[field]);

    if (result.success === false) {
      const errorMessage = formatZodError(field, result.error);

      return {
        isValid: false,
        error: errorMessage,
      };
    }

    return {
      isValid: true,
      parsedData: result.data,
    };
  };
}

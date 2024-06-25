import { ZodError } from "zod";

/**
 * Takes a Zod error and formats it into a string.
 * @param fieldName The name of the field that failed validation.
 * @param error The zod error to format.
 * @returns A human readable string representation of the error.
 */
export function formatZodError(fieldName: string, error: ZodError): string {
  let errorString: string = `${fieldName} validation failed: `;

  for (const issue of error.issues) {
    if (errorString.length > 0) {
      errorString += "\n";
    }

    if (issue.path.length > 0) {
      errorString += issue.path.join(".") + ": ";
    }

    errorString += issue.message;
  }

  return errorString;
}

import { DuvetExport } from "../core/common/DuvetExport";
import { isObjectWithField } from "./isObjectWithField";

/**
 * Tests if a value is a DuvetExport.
 * @param test The value to test
 * @returns A boolean indicating if the value is a DuvetExport.
 */
export function isDuvetExport(test: unknown): test is DuvetExport<unknown> {
  if (!isObjectWithField(test, "builtByDuvet")) return false;
  return test.builtByDuvet === true;
}

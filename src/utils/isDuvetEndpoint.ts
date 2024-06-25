import { DuvetEndpoint } from "../core/endpoint-builder/DuvetEndpoint";
import { isObjectWithField } from "./isObjectWithField";

/**
 * Tests if a value is a DuvetEndpoint object
 * @param test The value to test
 * @returns A boolean indicating if the value is a DuvetEndpoint object
 */
export function isDuvetEndpoint(
  test: unknown,
): test is DuvetEndpoint<unknown, unknown, unknown, unknown> {
  if (!isObjectWithField(test, "exportType")) return false;
  return test.exportType === "DuvetEndpoint";
}

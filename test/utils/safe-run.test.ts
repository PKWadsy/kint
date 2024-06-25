import { TryRunFailure, TryRunSuccess, safeRun } from "src/utils/safeRun";

describe("safeRun", () => {
  test("Returns the result of the function", () => {
    const result = safeRun(() => 1);
    expect(result.success).toBe(true);

    expect((result as TryRunSuccess<number>).result).toBe(1);
  });

  test("Returns the error if the function throws", () => {
    const error = new Error("error");
    const result = safeRun(() => {
      throw error;
    });
    expect(result.success).toBe(false);
    expect((result as TryRunFailure).error).toBe(error);
  });

  test("Allows arbitrary types to be thrown", () => {
    const result = safeRun(() => {
      throw "error";
    });
    expect(result.success).toBe(false);
    expect((result as TryRunFailure).error).toBe("error");
  });
});

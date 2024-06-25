import { mergeDefaultWithMissingItems } from "src/utils/mergeDefaultWithMissingItems";
import { extendObject } from "src/utils/extendObject";

describe("Config Helpers", () => {
  test("Default merging uses all defaults when no values provided", () => {
    type Output = { a: string; b: string; c: string };

    const defaults = {
      a: "defaultA",
      b: "defaultB",
      c: "defaultC",
    };

    const result: Output = mergeDefaultWithMissingItems<
      Output,
      typeof defaults
    >(defaults, {});

    expect(result).toEqual({
      a: "defaultA",
      b: "defaultB",
      c: "defaultC",
    });
  });

  test("Default merging uses all overrides when no defaults provided", () => {
    type Output = { a: string; b: string; c: string };

    const result: Output = mergeDefaultWithMissingItems<Output, object>(
      {},
      { a: "overrideA", b: "overrideB", c: "overrideC" },
    );

    expect(result).toEqual({
      a: "overrideA",
      b: "overrideB",
      c: "overrideC",
    });
  });
  test("Default merging overrides defaults", () => {
    type Output = { a: string; b: string; c: string };

    const defaults = {
      a: "defaultA",
      b: "defaultB",
    };

    const result: Output = mergeDefaultWithMissingItems<
      Output,
      typeof defaults
    >(defaults, {
      b: "overrideB",
      c: "overrideC",
    });

    expect(result).toEqual({
      a: "defaultA",
      b: "overrideB",
      c: "overrideC",
    });
  });

  test("Extension function overrides base values", () => {
    const base = {
      a: "baseA",
      b: "baseB",
    };

    const update = {
      b: "updateB",
      c: "updateC",
    };

    const result = extendObject(base, update);

    expect(result).toEqual({
      a: "baseA",
      b: "updateB",
      c: "updateC",
    });
  });

  // TODO: Make the extend object function work with nested objects
});

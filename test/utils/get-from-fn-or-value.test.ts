import { getFromFnOrValue } from "src/utils/getFromFnOrValue";

describe("GetFromFnOrValue", () => {
  test("Gets a raw value", () => {
    const newValue = { new: "value" };
    const oldValue = { old: "value" };

    const result = getFromFnOrValue(newValue, oldValue);

    // assert result is value
    expect(result).toBe(newValue);
  });

  test("Gets a value from a function", () => {
    const oldValue = { old: "value" };

    const result = getFromFnOrValue((old: typeof oldValue) => {
      const newValue = { new: old.old };
      return newValue;
    }, oldValue);

    // assert result is value
    expect(result).toMatchObject({ new: "value" });
  });
});

import { isObjectWithField } from "src/utils/isObjectWithField";

describe("isObjectWithField", () => {
  test("Returns true if the object has the specified field", () => {
    const obj = { name: "John", age: 30 };
    expect(isObjectWithField(obj, "name")).toBe(true);
    expect(isObjectWithField(obj, "age")).toBe(true);
  });

  test("Returns false if the object does not have the specified field", () => {
    const obj = { name: "John", age: 30 };
    expect(isObjectWithField(obj, "email")).toBe(false);
    expect(isObjectWithField(obj, "address")).toBe(false);
  });

  test("Returns false if the input is not an object", () => {
    expect(isObjectWithField(null, "name")).toBe(false);
    expect(isObjectWithField(123, "age")).toBe(false);
    expect(isObjectWithField("John", "email")).toBe(false);
    expect(isObjectWithField(undefined, "address")).toBe(false);
  });
});

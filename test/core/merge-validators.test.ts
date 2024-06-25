import { mergeValidators } from "src/core/endpoint-builder/mergeValidators";

describe("mergeValidators", () => {
  test("Merges multiple validator maps into a single object", () => {
    const validators = [
      { validator1: jest.fn(), validator2: jest.fn() },
      { validator3: jest.fn() },
      { validator4: jest.fn() },
    ] as const;

    const mergedValidators = mergeValidators(validators);

    expect(mergedValidators).toEqual({
      validator1: validators[0].validator1,
      validator2: validators[0].validator2,
      validator3: validators[1].validator3,
      validator4: validators[2].validator4,
    });
  });

  test("Returns an empty object if no validators are provided", () => {
    const mergedValidators = mergeValidators([]);

    expect(mergedValidators).toEqual({});
  });
});

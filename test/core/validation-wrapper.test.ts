import { wrapHandlerWithValidationLayer } from "src/core/endpoint-builder/handlerWithValidators";

describe("Validation wrapper", () => {
  test("Wraps a handler with a validation layer", async () => {
    const doStuff = jest.fn(() => {});

    const validateOne = jest.fn(() => {});
    const validateTwo = jest.fn(() => {});

    type Request = {
      body: string;
    };

    const validators = {
      testOne: (request: Request) => {
        expect(request.body).toEqual("body data");
        validateOne();
        return {
          isValid: true,
          parsedData: 10,
        } as const;
      },
      testTwo: (request: Request) => {
        expect(request.body).toEqual("body data");
        validateTwo();
        return {
          isValid: true,
          parsedData: {
            validatedData: "validated",
          },
        } as const;
      },
    };

    type Validators = typeof validators;

    const wrappedHandler = wrapHandlerWithValidationLayer<
      Request,
      string,
      { contextData: string },
      { configData: string },
      Validators
    >((request, context) => {
      expect(request.body).toEqual("body data");
      expect(context.valid.testOne).toEqual(10);
      expect(context.valid.testTwo).toEqual({
        validatedData: "validated",
      });
      expect(context.contextData).toEqual("context data");

      doStuff();

      return "ok";
    }, validators);

    const result = await wrappedHandler(
      { body: "body data" },
      { contextData: "context data" },
      { configData: "config data" },
    );

    expect(doStuff.mock.calls).toHaveLength(1);
    expect(validateOne.mock.calls).toHaveLength(1);
    expect(validateTwo.mock.calls).toHaveLength(1);
    expect(result).toBe("ok");
  });
});

import { DuvetEndpointBuilder } from "src/core/endpoint-builder/DuvetEndpointBuilder";
import { buildTestMiddleware } from "test-helpers/buildTestMiddleware";

describe("Middleware context", () => {
  test("Middleware correctly extends context object", async () => {
    const runMiddleware = jest.fn();

    const duvet = DuvetEndpointBuilder.new<object, object, object>()
      .addMiddleware(
        buildTestMiddleware("testOne", () => ({ a: "setA", b: 10 })),
      )
      .addMiddleware(buildTestMiddleware("testTwo", () => "setB"));

    const endpoint = duvet.defineEndpoint({}, (request, context) => {
      runMiddleware();

      expect(context).toMatchObject({
        testOne: { a: "setA", b: 10 },
        testTwo: "setB",
      });

      return {
        data: null,
        status: 200,
      };
    });

    await endpoint.data.handler({}, { global: {} });

    expect(runMiddleware).toHaveBeenCalled();
  });

  test("Global context is passed into the middleware and endpoint", async () => {
    const runEndpoint = jest.fn();
    const runMiddlewareOne = jest.fn();
    const runMiddlewareTwo = jest.fn();

    const duvet = DuvetEndpointBuilder.new<
      { a: string; b: number },
      object,
      object
    >()
      .addMiddleware(
        buildTestMiddleware("testOne", (config, globalContext) => {
          runMiddlewareOne();
          expect(globalContext).toMatchObject({ a: "string", b: 10 });
          return null;
        }),
      )
      .addMiddleware(
        buildTestMiddleware("testTwo", (config, globalContext) => {
          runMiddlewareTwo();
          expect(globalContext).toMatchObject({ a: "string", b: 10 });
          return null;
        }),
      );

    const endpoint = duvet.defineEndpoint({}, (request, context) => {
      runEndpoint();

      expect(context).toHaveProperty("global");
      expect(context.global).toMatchObject({ a: "string", b: 10 });

      return {
        data: null,
        status: 200,
      };
    });

    await endpoint.data.handler(
      {},
      {
        global: { a: "string", b: 10 },
      },
    );

    expect(runMiddlewareOne).toHaveBeenCalled();
    expect(runMiddlewareTwo).toHaveBeenCalled();
    expect(runEndpoint).toHaveBeenCalled();
  });
});

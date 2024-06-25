import { DuvetEndpointBuilder } from "src/core/endpoint-builder/DuvetEndpointBuilder";
import { buildTestMiddleware } from "test-helpers/buildTestMiddleware";
import { dudResponse } from "../express/e2e/dudResponse";

describe("Middleware Integration", () => {
  test("Middleware runs in the correct order", async () => {
    type Events =
      | "first before"
      | "first after"
      | "second before"
      | "second after"
      | "handler";

    const events: Events[] = [];

    const endpoint = DuvetEndpointBuilder.new<object, object, object>()
      .addMiddleware(
        buildTestMiddleware(
          "first",
          () => {
            events.push("first before");
          },
          (response) => {
            events.push("first after");
            return response;
          },
        ),
      )
      .addMiddleware(
        buildTestMiddleware(
          "second",
          () => {
            events.push("second before");
          },
          (response) => {
            events.push("second after");
            return response;
          },
        ),
      )
      .defineEndpoint(
        {
          first: {},
          second: {},
        },
        () => {
          events.push("handler");
          return dudResponse;
        },
      );

    await endpoint.data.handler({}, { global: {} });

    expect(events).toEqual([
      "second before",
      "first before",
      "handler",
      "first after",
      "second after",
    ]);
  });

  test("Adding middleware creates a new independent instance", async () => {
    const runMiddleware = jest.fn();
    const runEndpoint = jest.fn();
    const runEndpointWithMiddleware = jest.fn();

    const duvet = DuvetEndpointBuilder.new<object, object, object>();

    const withMiddleware = duvet.addMiddleware({
      handler: async (request, next) => {
        runMiddleware();
        return await next(null);
      },
      name: "test",
    });

    const endpoint = duvet.defineEndpoint({}, () => {
      runEndpoint();
      return dudResponse;
    });

    const endpointWithMiddleware = withMiddleware.defineEndpoint({}, () => {
      runEndpointWithMiddleware();
      return dudResponse;
    });

    await endpoint.data.handler({}, { global: {} });
    await endpointWithMiddleware.data.handler(
      {},
      {
        global: {},
      },
    );

    expect(runEndpoint.mock.calls).toHaveLength(1);
    expect(runMiddleware.mock.calls).toHaveLength(1);
    expect(runEndpointWithMiddleware.mock.calls).toHaveLength(1);
  });
});

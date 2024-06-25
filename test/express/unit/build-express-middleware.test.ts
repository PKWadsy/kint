import { buildExpressMiddleware } from "src/express/buildExpressMiddleware";

describe("buildExpressMiddleware", () => {
  test("Returns a middleware object with the correct name and handler", () => {
    const name = "testMiddleware";
    const handler = jest.fn();
    const middleware = buildExpressMiddleware(name, handler);

    expect(middleware.name).toBe(name);
    expect(middleware.handler).toBe(handler);
  });
});

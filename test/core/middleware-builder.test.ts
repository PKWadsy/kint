import { buildMiddleware } from "src/core/buildMiddleware";

describe("Middleware Builder", () => {
  test("Builds a middleware object correctly", async () => {
    const doThing = jest.fn(() => {});

    const middleware = buildMiddleware<
      object,
      object,
      "test",
      null,
      "context",
      null
    >("test", (request, next) => {
      doThing();
      return next("context");
    });

    expect(middleware.name).toBe("test");
    expect(middleware.handler).toBeDefined();

    await middleware.handler(
      { config: null, global: null, request: {} },
      (context: unknown) => {
        expect(context).toBe("context");
        return {};
      },
    );

    expect(doThing.mock.calls).toHaveLength(1);
  });
});

import path from "path";
import {
  ModuleLoadingError,
  NotDuvetEndpointError,
  NotDuvetExportError,
} from "src/core/endpoint-tree/fs-builder/applyFileToEndpointTree";
import { endpointTreeFromDirectory } from "src/core/endpoint-tree/fs-builder/endpointTreeFromDirectory";

describe("endpointTreeFromDirectory", () => {
  test("Builds a route tree from a correctly defined directory", async () => {
    const pathToRoutes = path.join(__dirname, "test-routes/standard");

    const endpointTree = endpointTreeFromDirectory(pathToRoutes);

    expect(endpointTree.name).toBe("");
    expect(endpointTree.endpoints).toHaveLength(5);

    expect(endpointTree.endpoint("DELETE")).toBeDefined();
    expect(endpointTree.endpoint("PATCH")).toBeDefined();
    expect(endpointTree.endpoint("POST")).toBeDefined();
    expect(endpointTree.endpoint("GET")).toBeDefined();
    expect(endpointTree.endpoint("PUT")).toBeDefined();

    expect(endpointTree.subRoutes).toHaveLength(3);

    const someRoute = endpointTree.subRoutes.find(
      (route) => route.name === "some-route",
    );
    const routeWithParam = endpointTree.subRoutes.find(
      (route) => route.name === "route-with-param",
    );

    expect(someRoute).toBeDefined();
    expect(routeWithParam).toBeDefined();

    if (someRoute == null || routeWithParam == null) return;

    expect(someRoute.endpoint("DELETE")).toBeDefined();
    expect(someRoute.endpoint("PATCH")).toBeDefined();
    expect(someRoute.endpoint("POST")).toBeDefined();
    expect(someRoute.endpoint("GET")).toBeDefined();
    expect(someRoute.endpoint("PUT")).toBeDefined();

    const paramRoute = routeWithParam.subRoutes.find(
      (route) => route.name === "param",
    );

    expect(paramRoute).toBeDefined();

    if (paramRoute == null) return;

    expect(paramRoute.isParam).toBe(true);

    expect(paramRoute.endpoint("DELETE")).toBeDefined();
    expect(paramRoute.endpoint("PATCH")).toBeDefined();
    expect(paramRoute.endpoint("POST")).toBeDefined();
    expect(paramRoute.endpoint("GET")).toBeDefined();
    expect(paramRoute.endpoint("PUT")).toBeDefined();

    const anotherParamRoute = paramRoute.subRoutes.find(
      (route) => route.name === "anotherParam",
    );

    expect(anotherParamRoute).toBeDefined();

    if (anotherParamRoute == null) return;

    expect(anotherParamRoute.isParam).toBe(true);

    expect(anotherParamRoute.endpoint("DELETE")).toBeDefined();
    expect(anotherParamRoute.endpoint("PATCH")).toBeDefined();
    expect(anotherParamRoute.endpoint("POST")).toBeDefined();
    expect(anotherParamRoute.endpoint("GET")).toBeDefined();
    expect(anotherParamRoute.endpoint("PUT")).toBeDefined();
  });

  test("Throws an error on no duvet export", async () => {
    const pathToRoutes = path.join(__dirname, "test-routes/no-duvet-export");

    expect(() => endpointTreeFromDirectory(pathToRoutes)).toThrow(
      NotDuvetExportError,
    );
  });
  test("Throws an error on no duvet endpoint", async () => {
    const pathToRoutes = path.join(__dirname, "test-routes/no-duvet-endpoint");

    expect(() => endpointTreeFromDirectory(pathToRoutes)).toThrow(
      NotDuvetEndpointError,
    );
  });
  test("Throws an error when there is no default export", async () => {
    const pathToRoutes = path.join(__dirname, "test-routes/no-default-export");

    expect(() => {
      endpointTreeFromDirectory(pathToRoutes);
    }).toThrow();
  });
  test("Throws an error on incorrect code", async () => {
    const pathToRoutes = path.join(__dirname, "test-routes/incorrect-code");

    expect(() => endpointTreeFromDirectory(pathToRoutes)).toThrow(
      ModuleLoadingError,
    );
  });
  test("Throws an error on built by duvet object but it is not a DuvetEndpoint", async () => {
    const pathToRoutes = path.join(
      __dirname,
      "test-routes/incorrect-built-by-duvet",
    );

    expect(() => endpointTreeFromDirectory(pathToRoutes)).toThrow();
  });

  test("Throws an error on no export", async () => {
    const pathToRoutes = path.join(__dirname, "test-routes/no-export");

    expect(() => endpointTreeFromDirectory(pathToRoutes)).toThrow();
  });

  test("Throws an error when a parameter is defined in a schema but not in a route path", async () => {
    const pathToRoutes = path.join(
      __dirname,
      "test-routes/invalid-parameter-routes",
    );

    expect(() => endpointTreeFromDirectory(pathToRoutes)).toThrow();
  });
});

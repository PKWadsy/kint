import { EndpointTreeNode } from "src/core/endpoint-tree/EndpointTree";
import { EndpointTreeEndpoint } from "src/core/endpoint-tree/EndpointTreeEndpoint";
import { dudResponse } from "./dudResponse";

describe("EndpointTreeNode", () => {
  test("Basic EndpointTreeNode constructor works properly", () => {
    const endpointTree = new EndpointTreeNode(null, "root", false);

    expect(endpointTree.endpoints).toEqual([]);
    expect(endpointTree.subRoutes).toEqual([]);
    expect(endpointTree.fullPath).toBe("root");
    expect(endpointTree.name).toBe("root");
    expect(endpointTree.params).toEqual([]);
    expect(endpointTree.parent).toBe(null);
    expect(endpointTree.isParam).toBe(false);
  });

  test("Adding a constructing a new EndpointTreeNode with a parent works properly", () => {
    const endpointTree = new EndpointTreeNode(null, "root", false);

    const subRoute = new EndpointTreeNode(endpointTree, "subRoute", false);

    expect(endpointTree.subRoutes).toHaveLength(1);
    expect(endpointTree.subRoutes).toMatchObject([subRoute]);
    expect(subRoute.parent).toBe(endpointTree);
    expect(subRoute.fullPath).toBe("root/subRoute");
  });

  test("Adding a subRoute twice does not duplicate it", () => {
    const endpointTree = new EndpointTreeNode(null, "root", false);

    const subRoute = new EndpointTreeNode(endpointTree, "subRoute", false);

    endpointTree.addSubRoute(subRoute);
    endpointTree.addSubRoute(subRoute);

    expect(endpointTree.subRoutes).toHaveLength(1);
    expect(endpointTree.subRoutes).toMatchObject([subRoute]);
    expect(subRoute.parent).toBe(endpointTree);
    expect(subRoute.fullPath).toBe("root/subRoute");
  });

  test("Adding a subRoute to an EndpointTreeNode works properly", () => {
    const endpointTree = new EndpointTreeNode(null, "root", false);

    const endpoint: EndpointTreeEndpoint<unknown, unknown, unknown, unknown> = {
      handler: () => dudResponse,
      config: {},
      method: "GET",
    };

    endpointTree.addEndpoint(endpoint);

    expect(endpointTree.endpoints).toHaveLength(1);
    expect(endpointTree.endpoints).toMatchObject([endpoint]);

    expect(endpointTree.endpoints[0].handler).toBe(endpoint.handler);
    expect(endpointTree.endpoints[0].config).toBe(endpoint.config);
    expect(endpointTree.endpoints[0].method).toBe(endpoint.method);
  });

  test("Adding an endpoint twice does not duplicate it", () => {
    const endpointTree = new EndpointTreeNode(null, "root", false);

    const endpoint: EndpointTreeEndpoint<unknown, unknown, unknown, unknown> = {
      handler: () => dudResponse,
      config: {},
      method: "GET",
    };

    endpointTree.addEndpoint(endpoint);
    endpointTree.addEndpoint(endpoint);

    expect(endpointTree.endpoints).toHaveLength(1);
    expect(endpointTree.endpoints).toMatchObject([endpoint]);
  });

  test("Adding an endpoint with the same method twice throws an error", () => {
    const endpointTree = new EndpointTreeNode(null, "root", false);

    const endpointOne: EndpointTreeEndpoint<
      unknown,
      unknown,
      unknown,
      unknown
    > = {
      handler: () => dudResponse,
      config: {},
      method: "GET",
    };

    const endpointTwo: EndpointTreeEndpoint<
      unknown,
      unknown,
      unknown,
      unknown
    > = {
      handler: () => dudResponse,
      config: {},
      method: "GET",
    };

    endpointTree.addEndpoint(endpointOne);

    expect(() => endpointTree.addEndpoint(endpointTwo)).toThrow();

    expect(endpointTree.endpoints).toHaveLength(1);
  });
});

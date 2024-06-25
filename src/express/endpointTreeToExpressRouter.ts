import { Request as ExpressRequest, Router } from "express";
import { EndpointTreeNode } from "../core/endpoint-tree/EndpointTree";
import { expressHandlerFromDuvetHandler } from "./expressHandlerFromDuvetHandler";
import { ExpressResponseWrapper } from "./models/ExpressResponseWrapper";
import { lowercase } from "../utils/lowercase";

/**
 * Takes an endpoint tree and converts it to an express router.
 * @param endpointTree The endpoint tree to convert
 * @param getContext A function which returns the context object to pass to the handler.
 * @param basePath The path for the router to be mounted at.
 * @returns An express router which can be mounted on an express app.
 */
export function endpointTreeToExpressRouter<Context, PluginConfig>(
  endpointTree: EndpointTreeNode<
    ExpressRequest,
    ExpressResponseWrapper,
    Context,
    PluginConfig
  >,
  getContext: () => Context,
  basePath: string = "",
) {
  const expressRouter = Router({
    mergeParams: true,
  });

  for (const endpoint of endpointTree.endpoints) {
    const handler = expressHandlerFromDuvetHandler(
      endpoint.handler,
      getContext,
    );

    const methodAsLower = lowercase(endpoint.method);

    expressRouter[methodAsLower]("/", handler);
  }

  for (const subRoute of endpointTree.subRoutes) {
    const subRouter = endpointTreeToExpressRouter(
      subRoute,
      getContext,
      basePath + "/" + subRoute.name,
    );

    const subRoutePath = "/" + (subRoute.isParam ? ":" : "") + subRoute.name;

    expressRouter.use(subRoutePath, subRouter);
  }

  return expressRouter;
}

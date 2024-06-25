import { Router, Request as ExpressRequest } from "express";
import { ExpressResponseWrapper } from "./models/ExpressResponseWrapper";
import { DuvetEndpointBuilder } from "../core/endpoint-builder/DuvetEndpointBuilder";
import { endpointTreeFromDirectory } from "../core/endpoint-tree/fs-builder/endpointTreeFromDirectory";
import { endpointTreeToExpressRouter } from "./endpointTreeToExpressRouter";
import { EndpointTreeNode } from "../core/endpoint-tree/EndpointTree";

type ExpressEndpointTreeNode<GlobalContext> = EndpointTreeNode<
  ExpressRequest,
  ExpressResponseWrapper,
  GlobalContext,
  unknown
>;

/**
 * @returns An object containing a Duvet instance and a function to build an Express router from a directory.
 */
export function createExpressDuvet<GlobalContext>() {
  return {
    /**
     * A DuvetEndpointBuilder instance for building endpoints.
     */
    duvet: DuvetEndpointBuilder.new<
      GlobalContext,
      ExpressRequest,
      ExpressResponseWrapper
    >(),
    /**
     * Builds an express router from a directory, with a given global context object.
     * @param directory An absolute or relative path to the directory containing the routes. If a relative path is provider, it will be relative to the current file, not the current working directory.
     * @param context A global context object which is passed into each handler and middleware.
     * @returns An express router which can be mounted on an express app.
     */
    build(directory: string, context: GlobalContext): Router {
      const endpointTree = endpointTreeFromDirectory(directory);
      const expressRouter = endpointTreeToExpressRouter(
        // TODO: Create some sort of verification method for express endpoint tree types.
        // eslint-disable-next-line no-type-assertion/no-type-assertion
        endpointTree as ExpressEndpointTreeNode<GlobalContext>,
        () => context,
      );
      return expressRouter;
    },
  };
}

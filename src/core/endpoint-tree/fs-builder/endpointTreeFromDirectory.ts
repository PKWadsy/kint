import { EndpointTreeNode } from "../EndpointTree";
import { applyDirectoryContentsToEndpointTreeNode } from "./applyDirectoryContentsToEndpointTreeNode";

/**
 * Builds an endpoint tree from a directory.
 * @param directory The path to the routes directory.
 * @returns An endpoint tree representing the directory.
 */
export function endpointTreeFromDirectory<
  RequestType,
  ResponseType,
  Context,
  PluginConfig,
>(directory: string) {
  const root = new EndpointTreeNode<
    RequestType,
    ResponseType,
    Context,
    PluginConfig
  >(null, "", false);

  applyDirectoryContentsToEndpointTreeNode(directory, root);

  return root;
}

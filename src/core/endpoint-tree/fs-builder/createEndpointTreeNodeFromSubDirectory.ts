import path from "path";
import { EndpointTreeNode } from "../EndpointTree";
import { applyDirectoryContentsToEndpointTreeNode } from "./applyDirectoryContentsToEndpointTreeNode";

/**
 * Creates an endpoint tree node from a sub directory. The name is set based on the name of the directory.
 * If the directory is a url param, the name is set to the url param name. This recursively populates the directory using
 * the `applyDirectoryToEndpointTreeNode` function.
 * @param directoryPath The absolute path to the directory.
 * @param parent The parent endpoint tree node.
 * @returns An endpoint tree node representing the directory.
 */
export function createEndpointTreeNodeFromSubDirectory<
  RequestType,
  ResponseType,
  Context,
  PluginConfig,
>(
  directoryPath: string,
  parent: EndpointTreeNode<RequestType, ResponseType, Context, PluginConfig>,
): EndpointTreeNode<RequestType, ResponseType, Context, PluginConfig> {
  const directoryObject = path.parse(directoryPath);
  const directoryName = directoryObject.name;
  // Check if it's a url param
  const urlParamRegExp = /^\[(\w+)\]$/;
  const result = directoryName.match(urlParamRegExp);
  const isUrlParam = result !== null;
  const routeName = isUrlParam ? result[1] : directoryName;

  const routeTree = new EndpointTreeNode<
    RequestType,
    ResponseType,
    Context,
    PluginConfig
  >(parent, routeName, isUrlParam);

  applyDirectoryContentsToEndpointTreeNode(directoryPath, routeTree);

  return routeTree;
}

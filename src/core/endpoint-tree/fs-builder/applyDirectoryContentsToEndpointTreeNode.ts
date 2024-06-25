import path from "path";
import { EndpointTreeNode } from "../EndpointTree";
import { getDirectoryContents } from "../../../utils/getDirectoryContents";
import { applyFileToEndpointTree } from "./applyFileToEndpointTree";
import { createEndpointTreeNodeFromSubDirectory } from "./createEndpointTreeNodeFromSubDirectory";

/**
 * Applies all the contents from a directory to a given endpoint tree node.
 * @param directoryPath The path to the routes directory.
 * @param endpointTreeNode The parent endpoint tree node.
 */
export function applyDirectoryContentsToEndpointTreeNode<
  RequestType,
  ResponseType,
  Context,
  PluginConfig,
>(
  directoryPath: string,
  endpointTreeNode: EndpointTreeNode<
    RequestType,
    ResponseType,
    Context,
    PluginConfig
  >,
) {
  const { directories, files } = getDirectoryContents(directoryPath);

  for (const subDir of directories) {
    const absolutePathToSubDir = path.join(directoryPath, subDir);
    createEndpointTreeNodeFromSubDirectory(
      absolutePathToSubDir,
      endpointTreeNode,
    );
  }

  for (const file of files) {
    applyFileToEndpointTree(path.join(directoryPath, file), endpointTreeNode);
  }
}

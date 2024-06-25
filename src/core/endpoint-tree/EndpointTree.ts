import { Method } from "../common/Method";
import { ConflictResult } from "./conflict/ConflictResult";
import { EndpointTreeEndpoint } from "./EndpointTreeEndpoint";

/**
 * Represents a node in an endpoint tree - a structure which represents the a hierarchy of endpoints.
 * Each endpoint has a full path, a name, and a parent node. It also has a list of sub-routes and endpoints.
 * Finally, it has a list of parameters which are used in the path as well as a flag to indicate if it is a parameter.
 */
export class EndpointTreeNode<
  RequestType,
  ResponseType,
  Context,
  PluginConfig,
> {
  /**
   * The full path of the endpoint, including all parent nodes.
   */
  private _fullPath: string;

  /**
   * The name of the endpoint.
   */
  private _name: string;

  /**
   * The parent node of the endpoint.
   */
  private _parent: EndpointTreeNode<
    RequestType,
    ResponseType,
    Context,
    PluginConfig
  > | null;

  /**
   * A flag to indicate if the endpoint is a parameter.
   */
  private _isParam: boolean;

  /**
   * A list of parameters which are used in the path.
   */
  private _params: string[] = [];

  /**
   * A list of endpoints which stem from this node.
   */
  private _endpoints: EndpointTreeEndpoint<
    RequestType,
    ResponseType,
    Context,
    unknown & PluginConfig
  >[];

  /**
   * A list of sub-routes. Each sub-route is another node in the tree.
   */
  private _subRoutes: EndpointTreeNode<
    RequestType,
    ResponseType,
    Context,
    PluginConfig
  >[];

  constructor(
    parent: EndpointTreeNode<
      RequestType,
      ResponseType,
      Context,
      PluginConfig
    > | null,
    name: string,
    isParam: boolean,
  ) {
    this._parent = parent;

    this._name = name;
    this._fullPath = name;

    this._endpoints = [];
    this._subRoutes = [];

    this._isParam = isParam;

    if (parent != null) this.setParent(parent);
  }

  /**
   * Sets the parent node of the current node. This also sets the full path and parameters of the current node,
   * as well as adding the current node to the parent's list of sub-routes.
   * @param parent The parent node of the current node.
   */
  private setParent(
    parent: EndpointTreeNode<RequestType, ResponseType, Context, PluginConfig>,
  ) {
    this._parent = parent;
    this._fullPath = `${this._parent.fullPath}/${this._name}`;
    this._params = [...this._parent.params];
    if (this._isParam) {
      this._params.push(this._name);
    }
    parent.addSubRoute(this);
  }

  /**
   * @returns the list of endpoints which stem from the current node.
   */
  public get endpoints() {
    return this._endpoints;
  }

  /**
   * @returns the list of sub-routes which stem from the current node.
   */
  public get subRoutes() {
    return this._subRoutes;
  }

  /**
   * @returns the full path of the current node.
   */
  public get fullPath() {
    return this._fullPath;
  }

  /**
   * @returns the name of the current node.
   */
  public get name() {
    return this._name;
  }

  /**
   * @returns The parameters of the current node. This includes all parameters from the parent nodes.
   */
  public get params() {
    return this._params;
  }

  /**
   * @returns The parent node of the current node.
   */
  public get parent() {
    return this._parent;
  }

  /**
   * @returns A flag to indicate if the current node is a parameter.
   */
  public get isParam() {
    return this._isParam;
  }

  /**
   * Adds an endpoint to the current node. If the endpoint is already present, it will not be added.
   * @param endpoint The endpoint to add to the current node.
   */
  public addEndpoint(
    endpoint: EndpointTreeEndpoint<
      RequestType,
      ResponseType,
      Context,
      unknown & PluginConfig
    >,
  ): void {
    if (this._endpoints.includes(endpoint)) return;

    const conflict = this.checkConflict(endpoint);

    if (conflict.conflict) {
      throw new DuvetEndpointConflictError(
        `There was a conflict trying to add the endpoint ${conflict.newEndpoint.method} to the route ${this._fullPath}. The method is already defined in the route ${this._fullPath}`,
        conflict,
      );
    }
    this._endpoints.push(endpoint);
  }

  /**
   * Adds a sub-route to the current node. If the sub-route is already present, it will not be added.
   * @param subRoute The sub-route to add to the current node.
   */
  public addSubRoute(
    subRoute: EndpointTreeNode<
      RequestType,
      ResponseType,
      Context,
      PluginConfig
    >,
  ): void {
    if (this.subRoutes.includes(subRoute)) return;
    this._subRoutes.push(subRoute);
  }

  /**
   * Gets an endpoint from the current node by method.
   * @param method The method of the endpoint to get.
   * @returns And endpoint if it exists, otherwise null.
   */
  public endpoint(
    method: Method,
  ): EndpointTreeEndpoint<
    RequestType,
    ResponseType,
    Context,
    unknown & PluginConfig
  > | null {
    return this._endpoints.find((e) => e.method === method) ?? null;
  }

  /**
   * Checks to see if there is a conflict between the current node's endpoints and the endpoint being added.
   * @param endpoint The endpoint to check for conflicts with.
   * @returns A `ConflictResult` object which contains information about the conflict.
   */
  public checkConflict(
    endpoint: EndpointTreeEndpoint<
      RequestType,
      ResponseType,
      Context,
      unknown & PluginConfig
    >,
  ): ConflictResult<RequestType, ResponseType, Context, PluginConfig> {
    const existingEndpoint = this._endpoints.find(
      (e) => e.method === endpoint.method,
    );

    if (existingEndpoint) {
      return {
        conflict: true,
        existingEndpoint,
        newEndpoint: endpoint,
      };
    } else {
      return {
        conflict: false,
      };
    }
  }
}

export class DuvetEndpointConflictError extends Error {
  constructor(
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public conflict: ConflictResult<any, any, any, any>,
  ) {
    super(message);
    this.name = "DuvetEndpointConflictError";
  }
}

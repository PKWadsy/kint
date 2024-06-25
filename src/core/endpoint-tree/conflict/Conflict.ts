import { EndpointTreeEndpoint } from "../EndpointTreeEndpoint";

export type Conflict<RequestType, ResponseType, Context, PluginConfig> = {
  conflict: true;
  newEndpoint: EndpointTreeEndpoint<
    RequestType,
    ResponseType,
    Context,
    unknown & PluginConfig
  >;
  existingEndpoint: EndpointTreeEndpoint<
    RequestType,
    ResponseType,
    Context,
    unknown & PluginConfig
  >;
};

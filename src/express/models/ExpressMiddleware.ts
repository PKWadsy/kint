import { Request as ExpressRequest } from "express";
import { Middleware, MiddlewareHandler } from "../../core/common/Middleware";
import { ExpressResponseWrapper } from "./ExpressResponseWrapper";

export type ExpressMiddleware<
  Name extends string,
  ConfigExtension = void,
  ContextExtension = void,
  GlobalContext = unknown,
> = Middleware<
  ExpressRequest,
  ExpressResponseWrapper,
  Name,
  ConfigExtension,
  ContextExtension,
  GlobalContext
>;

export type ExpressMiddlewareHandler<
  ConfigExtension = void,
  ContextExtension = void,
  GlobalContext = unknown,
> = MiddlewareHandler<
  ExpressRequest,
  ExpressResponseWrapper,
  ConfigExtension,
  ContextExtension,
  GlobalContext
>;

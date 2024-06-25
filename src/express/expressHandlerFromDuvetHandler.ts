import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { Handler } from "../core/common/Handler";
import { sendWrappedExpressResponse } from "./sendWrappedExpressResponse";
import { ExpressResponseWrapper } from "./models/ExpressResponseWrapper";
import { BaseContext } from "../core/common/BaseContext";

/**
 * Takes an endpoint definition and context provider and returns an express handler which can be passed to any Express `use` directive (or equivalent).
 * @param handler The endpoint definition to create a handler for.
 * @param getContext A function which returns the context object to pass to the handler.
 * @returns An express handler function which can be passed to any Express `use` directive (or equivalent).
 */
export function expressHandlerFromDuvetHandler<GlobalContext>(
  handler: Handler<
    ExpressRequest,
    ExpressResponseWrapper,
    BaseContext<GlobalContext>
  >,
  getContext: () => GlobalContext,
) {
  return function expressHandler(
    expressRequest: ExpressRequest,
    expressResponse: ExpressResponse,
  ) {
    const wrappedExpressResponse = handler(expressRequest, {
      global: getContext(),
    });

    if (wrappedExpressResponse instanceof Promise) {
      wrappedExpressResponse.then((wrappedExpressResponse) => {
        sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);
      });
    } else {
      sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);
    }
  };
}

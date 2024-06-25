// sendResponse.ts
import { Response } from "express";
import { ExpressResponseWrapper } from "./models/ExpressResponseWrapper";

/**
 * Sends a wrapped express response.
 * @param wrappedExpressResponse The wrapped express response to send.
 * @param expressResponse The express response object to send the response with.
 */
export function sendWrappedExpressResponse(
  wrappedExpressResponse: ExpressResponseWrapper,
  expressResponse: Response,
): void {
  const {
    status = 200,
    statusMessage,
    headers = {},
    cookies = {},
    clearCookies = [],
    data,
    redirectUrl,
    filePath,
    fileDownloadName,
    buffer,
    stream,
    responseType,
  } = wrappedExpressResponse;

  // Setting status and status message
  if (statusMessage) {
    expressResponse.status(status).statusMessage = statusMessage;
  } else {
    expressResponse.status(status);
  }

  // Setting headers
  Object.keys(headers).forEach((key) => {
    const headerValue = headers[key];
    expressResponse.setHeader(key, headerValue);
  });

  // Setting cookies
  Object.keys(cookies).forEach((key) => {
    expressResponse.cookie(key, cookies[key]);
  });

  // Clearing cookies
  clearCookies.forEach((cookieName) => {
    expressResponse.clearCookie(cookieName);
  });

  // Setting response type
  if (responseType) {
    expressResponse.type(responseType);
  }

  // Handling redirection
  if (redirectUrl) {
    expressResponse.redirect(status, redirectUrl);
    return;
  }

  // Handling file download
  if (filePath) {
    if (fileDownloadName) {
      expressResponse.download(filePath, fileDownloadName);
    } else {
      expressResponse.sendFile(filePath);
    }
    return;
  }

  // Handling buffer
  if (buffer) {
    expressResponse.send(buffer);
    return;
  }

  // Handling stream
  if (stream) {
    stream.pipe(expressResponse);
    return;
  }

  // Sending the response as a json object
  expressResponse.send(data);
}

import { Response } from "express";
import { sendWrappedExpressResponse } from "src/express/sendWrappedExpressResponse";
import { ExpressResponseWrapper } from "src/express/models/ExpressResponseWrapper";
import { ReadStream } from "fs";

describe("sendWrappedExpressResponse", () => {
  let expressResponse: Response;

  beforeEach(() => {
    expressResponse = {
      status: jest.fn().mockReturnThis(),
      statusMessage: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      type: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
      download: jest.fn(),
      sendFile: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
  });

  test("should set status and status message if provided", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      status: 404,
      statusMessage: "Not Found",
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.status).toHaveBeenCalledWith(404);
    expect(expressResponse.statusMessage).toBe("Not Found");
  });

  test("should set headers", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "Custom Value",
      },
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(expressResponse.setHeader).toHaveBeenCalledWith(
      "X-Custom-Header",
      "Custom Value",
    );
  });

  test("should set cookies", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      cookies: {
        sessionId: "123456",
        userId: "7890",
      },
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.cookie).toHaveBeenCalledWith("sessionId", "123456");
    expect(expressResponse.cookie).toHaveBeenCalledWith("userId", "7890");
  });

  test("should clear cookies", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      clearCookies: ["sessionId", "userId"],
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.clearCookie).toHaveBeenCalledWith("sessionId");
    expect(expressResponse.clearCookie).toHaveBeenCalledWith("userId");
  });

  test("should set response type", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      responseType: "application/json",
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.type).toHaveBeenCalledWith("application/json");
  });

  test("should handle redirection", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      status: 302,
      redirectUrl: "/new-url",
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.redirect).toHaveBeenCalledWith(302, "/new-url");
  });

  test("should handle file download", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      filePath: "/path/to/file",
      fileDownloadName: "file.txt",
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.download).toHaveBeenCalledWith(
      "/path/to/file",
      "file.txt",
    );
  });

  test("should handle buffer", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      buffer: Buffer.from("Hello, world!"),
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.send).toHaveBeenCalledWith(
      Buffer.from("Hello, world!"),
    );
  });

  test("should handle stream", () => {
    const stream = {
      pipe: jest.fn().mockReturnThis(),
    } as unknown as ReadStream;

    const wrappedExpressResponse: ExpressResponseWrapper = {
      stream,
      data: {},
    };

    // Mock the pipe method
    stream.pipe = jest.fn().mockReturnThis();

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(stream.pipe).toHaveBeenCalledWith(expressResponse);
  });

  test("should send the response as a json object if no other options are provided", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      data: { message: "Hello, world!" },
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.send).toHaveBeenCalledWith({
      message: "Hello, world!",
    });
  });

  test("should send a file if a file path is provided without a download name", () => {
    const wrappedExpressResponse: ExpressResponseWrapper = {
      filePath: "/path/to/file",
      data: {},
    };

    sendWrappedExpressResponse(wrappedExpressResponse, expressResponse);

    expect(expressResponse.sendFile).toHaveBeenCalledWith("/path/to/file");
  });
});

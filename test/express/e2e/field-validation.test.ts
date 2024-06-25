import path from "path";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { Context } from "./Context";
import { build } from "./duvet";

describe("Field Validation", () => {
  test("Handler validates and returns number param passed to endpoint", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "N/A", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    const response = await request(app)
      .get("/with-validation/with-params/123456")
      .expect(200);

    expect(response.text).toBe("123456");
  });

  test("Handler validates and rejects incorrect param passed to endpoint ", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "N/A", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    await request(app)
      .get("/with-validation/with-params/test_value")
      .expect(500); // TODO: Have response give a nicer error message
  });

  test.each([
    ["body", "query", "headers", "cookies", 200],
    ["wrong", "query", "headers", "cookies", 500],
    ["body", "wrong", "headers", "cookies", 500],
    ["body", "query", "wrong", "cookies", 500],
    ["body", "query", "headers", "wrong", 500],
  ])(
    "/with-validation/ body: %s query: %s headers: %s cookies: %s returns %i",
    async (body, query, headers, cookies, expected_status_code) => {
      const routes = path.join(__dirname, "routes");

      const context: Context = { a: "N/A", b: 0 };

      const router = build(routes, context);

      const app = express();

      app.use(express.json());
      app.use(cookieParser());
      app.use("/", router);

      const response = await request(app)
        .get("/with-validation")
        .set("value", headers)
        .query({ value: query })
        .set("Cookie", `value=${cookies}`)
        .send({ value: body })
        .expect(expected_status_code);

      if (expected_status_code === 200) {
        expect(response.text).toBe("Success");
      }
    },
  );
});

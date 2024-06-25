import path from "path";
import request from "supertest";
import express from "express";
import { Context } from "./Context";
import { build } from "./duvet";

describe("Params", () => {
  test("Handler validates and returns string body value passed to endpoint", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "N/A", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    const response = await request(app)
      .post("/")
      .send({ value: "success" })
      .expect(200);

    expect(response.text).toBe("success");
  });

  test("Handler validates and rejects incorrect body value passed to endpoint ", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "N/A", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    await request(app).post("/").send({ value: 123456 }).expect(500); // TODO: Have response give a nicer error message
  });
});

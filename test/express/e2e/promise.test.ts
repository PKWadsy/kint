import path from "path";
import request from "supertest";
import express from "express";
import { Context } from "./Context";
import { build } from "./duvet";

describe("Promise", () => {
  test("Endpoint successfully returns a response from a promise", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "N/A", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    const response = await request(app).get("/promise").expect(200);
    expect(response.text).toBe("Success");
  });
});

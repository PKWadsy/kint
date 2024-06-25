import path from "path";
import request from "supertest";
import express from "express";
import { Context } from "./Context";
import { build } from "./duvet";

describe("Context", () => {
  test("Handler passes context through when being run", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "initialA", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    await request(app).get("/").expect(200);

    expect(context.a).toBe("setA");
    expect(context.b).toBe(25);
  });
});

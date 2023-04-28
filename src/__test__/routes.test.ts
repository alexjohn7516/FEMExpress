import app from "../server";
import supertest from "supertest";

describe("GET /", () => {
  it("Responds with json formatted data", async () => {
    const res = await supertest(app).get("/");

    expect(res.body.message).toBe("hello");
  });
});

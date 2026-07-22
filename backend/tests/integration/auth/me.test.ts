import app from "#/app";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("GET /api/v1/auth/me", () => {
  it("should return the current authenticated user", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "Password@123",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      id: expect.any(String),
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
    });
  });

  it("should return 401 when token is missing", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Unauthorized",
    });
  });
});

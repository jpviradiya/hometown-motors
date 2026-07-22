import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "#/app";


describe("POST /api/v1/auth/register", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      message: "User registered successfully",
    });
  });
});

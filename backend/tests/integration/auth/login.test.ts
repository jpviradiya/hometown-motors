import app from "#/app";
import request from "supertest";
import { describe, it, expect } from "vitest";

describe("POST /api/v1/auth/login", () => {
  it("should login successfully with valid credentials", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Login successful",
      token: expect.any(String),
    });
  });

  it("should return 401 when email does not exist", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "unknown@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Invalid email or password",
    });
  });

  it("should return 401 when password is incorrect", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "WrongPassword@123",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Invalid email or password",
    });
  });
});

import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "#/app";

// Integration tests for the user registration endpoint.
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

  it("should return 409 if email already exists", async () => {
    const payload = {
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    };

    await request(app).post("/api/v1/auth/register").send(payload);

    const response = await request(app).post("/api/v1/auth/register").send(payload);

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      message: "Email already exists",
    });
  });

  it("should return 400 when name is missing", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "john@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "name is required",
    });
  });

  it("should return 400 when email is missing", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "email is required",
    });
  });

  it("should return 400 when password is missing", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "password is required",
    });
  });

  it("should return 400 when email format is invalid", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "johnexample.com",
      password: "Password@123",
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid email address",
    });
  });

  it("should return 400 when password is less than 8 characters", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Pass1",
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Password must be at least 8 characters long",
    });
  });
});

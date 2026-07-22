import { describe, expect, it } from "vitest";
import { AuthRepository } from "#/repositories";
import { AuthService } from "#/services";
import request from "supertest";
import app from "#/app";
import { prisma } from "#/lib/prisma";

describe("AuthService", () => {
  it("should hash the password before saving the user", async () => {
    const repository = new AuthRepository();
    const service = new AuthService(repository);

    await service.register({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });

    const user = await repository.findByEmail("john@example.com");

    expect(user).not.toBeNull();
    expect(user?.passwordHash).not.toBe("Password@123");
  });

  it("should return a JWT token after successful login", async () => {
    const repository = new AuthRepository();
    const service = new AuthService(repository);

    await service.register({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });

    const response = await service.login({
      email: "john@example.com",
      password: "Password@123",
    });

    expect(response).toEqual({
      message: "Login successful",
      token: expect.any(String),
    });
  });

  it("should allow admin to access protected route", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "Admin",
      email: "admin@test.com",
      password: "Password@123",
    });

    await prisma.user.update({
      where: {
        email: "admin@test.com",
      },
      data: {
        role: "ADMIN",
      },
    });

    const login = await request(app).post("/api/v1/auth/login").send({
      email: "admin@test.com",
      password: "Password@123",
    });

    const response = await request(app)
      .get("/api/v1/auth/admin")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Access granted",
    });
  });

  it("should deny normal user", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "User",
      email: "user@test.com",
      password: "Password@123",
    });

    const login = await request(app).post("/api/v1/auth/login").send({
      email: "user@test.com",
      password: "Password@123",
    });

    const response = await request(app)
      .get("/api/v1/auth/admin")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Forbidden",
    });
  });
});

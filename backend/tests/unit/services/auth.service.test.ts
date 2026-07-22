import { describe, expect, it } from "vitest";
import { AuthRepository } from "#/repositories";
import { AuthService } from "#/services";

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
});

describe("AuthService - Login", () => {
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
});
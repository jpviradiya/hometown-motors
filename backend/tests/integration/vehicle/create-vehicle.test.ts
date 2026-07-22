import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { prisma } from "#/lib/prisma";
import { generateJwtToken } from "#/lib/jwt";
import app from "#/app";

describe("POST /api/v1/vehicles", () => {
  beforeEach(async () => {
    await prisma.purchase.deleteMany();
    await prisma.vehicleImage.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should create a vehicle when requested by an admin", async () => {
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@test.com",
        passwordHash: "hashed-password",
        role: "ADMIN",
      },
    });

    const token = generateJwtToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response = await request(app)
      .post("/api/v1/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Corolla",
        category: "SEDAN",
        year: 2024,
        fuelType: "PETROL",
        color: "White",
        transmission: "AUTOMATIC",
        price: 25000,
        quantity: 10,
        description: "Reliable family sedan",
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      message: "Vehicle created successfully",
      vehicle: {
        make: "Toyota",
        model: "Corolla",
      },
    });

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        make: "Toyota",
      },
    });

    expect(vehicle).not.toBeNull();
    expect(vehicle?.model).toBe("Corolla");
  });

  it("should return 403 when a normal user tries to create a vehicle", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John",
        email: "john@test.com",
        passwordHash: "hashed-password",
        role: "USER",
      },
    });

    const token = generateJwtToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const response = await request(app)
      .post("/api/v1/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Corolla",
        category: "SEDAN",
        year: 2024,
        fuelType: "PETROL",
        color: "White",
        transmission: "AUTOMATIC",
        price: 25000,
        quantity: 10,
        description: "Reliable family sedan",
      });

    expect(response.status).toBe(403);

    expect(response.body).toMatchObject({
      message: expect.any(String),
    });

    const vehicles = await prisma.vehicle.findMany();

    expect(vehicles).toHaveLength(0);
  });
});

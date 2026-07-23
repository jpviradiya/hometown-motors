import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import app from "#/app";
import { generateJwtToken } from "#/lib/jwt";
import { prisma } from "#/lib/prisma";

async function createUser(role: "ADMIN" | "USER") {
  const email = `${role.toLowerCase()}-${Date.now()}@test.com`;

  const user = await prisma.user.create({
    data: {
      name: role,
      email,
      passwordHash: "hashed-password",
      role,
    },
  });

  const token = generateJwtToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
}

async function createVehicle() {
  return prisma.vehicle.create({
    data: {
      make: "Toyota",
      model: "Corolla",
      category: "SEDAN",
      year: 2024,
      fuelType: "PETROL",
      color: "White",
      transmission: "AUTOMATIC",
      price: 25000,
      quantity: 10,
      description: "Test vehicle",
    },
  });
}

describe("POST /api/v1/vehicles/:id/purchase", () => {
  beforeEach(async () => {
    await prisma.$transaction(
      [
        prisma.purchase.deleteMany(),
        prisma.vehicleImage.deleteMany(),
        prisma.vehicle.deleteMany(),
        prisma.user.deleteMany(),
      ],
      {
        maxWait: 30000,
        timeout: 30000,
      }
    );
  });

  it("should purchase a vehicle", async () => {
    const { user, token } = await createUser("USER");

    const vehicle = await createVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 2,
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      message: "Vehicle purchased successfully",
    });

    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        vehicleId: vehicle.id,
      },
    });

    expect(purchase).not.toBeNull();
    expect(purchase?.quantity).toBe(2);
    expect(Number(purchase?.purchasePrice)).toBe(25000);

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicle.id,
      },
    });

    expect(updatedVehicle?.quantity).toBe(8);
  });

  it("should return 404 when vehicle does not exist", async () => {
    const { token } = await createUser("USER");

    const response = await request(app)
      .post("/api/v1/vehicles/non-existent-id/purchase")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      });

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      message: "Vehicle not found",
    });
  });

  it("should return 400 when quantity is less than or equal to zero", async () => {
    const { token } = await createUser("USER");

    const vehicle = await createVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 0,
      });

    expect(response.status).toBe(400);
  });

  it("should return 409 when requested quantity exceeds available stock", async () => {
    const { token } = await createUser("USER");

    const vehicle = await createVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 100,
      });

    expect(response.status).toBe(409);

    expect(response.body).toMatchObject({
      message: "Insufficient stock",
    });
  });
});

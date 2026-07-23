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

describe("GET /api/v1/purchases/me", () => {
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

  it("should return the authenticated user's purchases", async () => {
    const { user, token } = await createUser("USER");
    const { user: anotherUser } = await createUser("USER");

    const vehicle = await createVehicle();

    await prisma.purchase.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        quantity: 2,
        purchasePrice: 25000,
      },
    });

    await prisma.purchase.create({
      data: {
        userId: anotherUser.id,
        vehicleId: vehicle.id,
        quantity: 1,
        purchasePrice: 25000,
      },
    });

    const response = await request(app)
      .get("/api/v1/purchases/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.purchases).toHaveLength(1);

    expect(response.body.purchases[0]).toMatchObject({
      quantity: 2,
      purchasePrice: "25000",
      vehicle: {
        make: "Toyota",
        model: "Corolla",
      },
    });
  });
});

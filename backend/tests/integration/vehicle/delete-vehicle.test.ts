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
      imageUrl: "https://example.com/car.jpg",
    },
  });
}

describe("DELETE /api/v1/vehicles/:id", () => {
  // Redundant beforeEach database cleanup removed in favor of global setup.ts cleanup

  it("should delete a vehicle", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .delete(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      message: "Vehicle deleted successfully",
    });

    const deletedVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicle.id,
      },
    });

    expect(deletedVehicle).toBeNull();
  });

  it("should return 404 when deleting a non-existent vehicle", async () => {
    const { token } = await createUser("ADMIN");

    const response = await request(app)
      .delete("/api/v1/vehicles/non-existent-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      message: "Vehicle not found",
    });
  });

  it("should return 403 when a non-admin deletes a vehicle", async () => {
    const { token } = await createUser("USER");

    const vehicle = await createVehicle();

    const response = await request(app)
      .delete(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);

    expect(response.body).toMatchObject({
      message: "Forbidden",
    });
  });

  it("should return 409 when deleting a vehicle with purchase history", async () => {
    const { user } = await createUser("USER");
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    await prisma.purchase.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        quantity: 1,
        purchasePrice: 25000,
      },
    });

    const response = await request(app)
      .delete(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);

    expect(response.body).toMatchObject({
      message: "Vehicle cannot be deleted because it has purchase history",
    });
  });
});

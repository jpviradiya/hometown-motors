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

  return {
    user,
    token,
  };
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

describe("PATCH /api/v1/vehicles/:id", () => {
  // Redundant beforeEach database cleanup removed in favor of global setup.ts cleanup

  it("should update a vehicle", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 30000,
        quantity: 20,
        description: "Updated description",
      });

    expect(response.status).toBe(200);

    expect(response.body.vehicle).toMatchObject({
      price: "30000",
      quantity: 20,
      description: "Updated description",
    });

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicle.id,
      },
    });

    expect(Number(updatedVehicle?.price)).toBe(30000);
    expect(updatedVehicle?.quantity).toBe(20);
    expect(updatedVehicle?.description).toBe("Updated description");
  });

  it("should return 404 when updating a non-existent vehicle", async () => {
    const { token } = await createUser("ADMIN");

    const response = await request(app)
      .patch("/api/v1/vehicles/non-existent-id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 30000,
      });

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      message: "Vehicle not found",
    });
  });

  it("should return 403 when a non-admin updates a vehicle", async () => {
    const { token } = await createUser("USER");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 30000,
      });

    expect(response.status).toBe(403);

    expect(response.body).toMatchObject({
      message: "Forbidden",
    });
  });

  it("should return 400 when price is less than or equal to zero", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 0,
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 when quantity is negative", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: -1,
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 when transmission is invalid", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        transmission: "INVALID",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 when fuel type is invalid", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        fuelType: "INVALID",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 when category is invalid", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        category: "INVALID",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 when year is invalid", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        year: 1800,
      });

    expect(response.status).toBe(400);
  });

  it("should update only the provided fields", async () => {
    const { token } = await createUser("ADMIN");

    const vehicle = await createVehicle();

    const response = await request(app)
      .patch(`/api/v1/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 35000,
      });

    expect(response.status).toBe(200);

    expect(response.body.vehicle).toMatchObject({
      make: "Toyota",
      model: "Corolla",
      year: 2024,
      quantity: 10,
      description: "Test vehicle",
      price: "35000",
    });

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicle.id,
      },
    });

    expect(updatedVehicle).not.toBeNull();

    expect(updatedVehicle!.make).toBe("Toyota");
    expect(updatedVehicle!.model).toBe("Corolla");
    expect(updatedVehicle!.year).toBe(2024);
    expect(updatedVehicle!.quantity).toBe(10);
    expect(updatedVehicle!.description).toBe("Test vehicle");
    expect(Number(updatedVehicle!.price)).toBe(35000);
  });
});

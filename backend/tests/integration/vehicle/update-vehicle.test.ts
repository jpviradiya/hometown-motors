import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";
import { generateJwtToken } from "#/lib/jwt";

describe("PATCH /api/v1/vehicles/:id", () => {
  beforeEach(async () => {
    await prisma.purchase.deleteMany();
    await prisma.vehicleImage.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should update a vehicle", async () => {
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

    const vehicle = await prisma.vehicle.create({
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
        description: "Old description",
      },
    });

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
      price: 30000,
      quantity: 20,
      description: "Updated description",
    });

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicle.id,
      },
    });

    expect(updatedVehicle?.price).toBe(30000);
    expect(updatedVehicle?.quantity).toBe(20);
    expect(updatedVehicle?.description).toBe("Updated description");
  });
});

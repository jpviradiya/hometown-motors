import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";

describe("GET /api/v1/vehicles", () => {
  beforeEach(async () => {
    await prisma.purchase.deleteMany();
    await prisma.vehicleImage.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should return an empty array when no vehicles exist", async () => {
    const response = await request(app).get("/api/v1/vehicles");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      vehicles: [],
    });
  });

  it("should return all vehicles", async () => {
    await prisma.vehicle.createMany({
      data: [
        {
          make: "Toyota",
          model: "Corolla",
          category: "SEDAN",
          year: 2024,
          fuelType: "PETROL",
          color: "White",
          transmission: "AUTOMATIC",
          price: 25000,
          quantity: 10,
          description: "Reliable sedan",
        },
        {
          make: "Honda",
          model: "City",
          category: "SEDAN",
          year: 2023,
          fuelType: "PETROL",
          color: "Black",
          transmission: "MANUAL",
          price: 22000,
          quantity: 5,
          description: "Comfortable sedan",
        },
      ],
    });

    const response = await request(app).get("/api/v1/vehicles");

    expect(response.status).toBe(200);

    expect(response.body.vehicles).toHaveLength(2);

    expect(response.body.vehicles[0]).toMatchObject({
      make: "Toyota",
    });

    expect(response.body.vehicles[1]).toMatchObject({
      make: "Honda",
    });
  });
});

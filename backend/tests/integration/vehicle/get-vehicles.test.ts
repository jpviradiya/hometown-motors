import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";

describe("GET /api/v1/vehicles", () => {
  beforeEach(async () => {
    await prisma.$transaction([
      prisma.purchase.deleteMany(),
      prisma.vehicleImage.deleteMany(),
      prisma.vehicle.deleteMany(),
      prisma.user.deleteMany(),
    ]);
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

  it("should return paginated vehicles", async () => {
    await prisma.vehicle.createMany({
      data: Array.from({ length: 15 }, (_, index) => ({
        make: `Toyota-${index + 1}`,
        model: `Model-${index + 1}`,
        category: "SEDAN",
        year: 2024,
        fuelType: "PETROL",
        color: "White",
        transmission: "AUTOMATIC",
        price: 20000 + index,
        quantity: 5,
        description: "Vehicle",
      })),
    });

    const response = await request(app).get("/api/v1/vehicles?page=2&limit=5");

    expect(response.status).toBe(200);

    expect(response.body.vehicles).toHaveLength(5);

    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 15,
      totalPages: 3,
    });

    expect(response.body.vehicles[0].make).toBe("Toyota-6");
  });
});

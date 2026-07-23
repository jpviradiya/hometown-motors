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
      pagination: {
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
      },
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

  it("should return vehicles matching the search term", async () => {
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
          quantity: 5,
          description: "Toyota Corolla",
        },
        {
          make: "Honda",
          model: "City",
          category: "SEDAN",
          year: 2024,
          fuelType: "PETROL",
          color: "Black",
          transmission: "MANUAL",
          price: 22000,
          quantity: 8,
          description: "Honda City",
        },
        {
          make: "Toyota",
          model: "Fortuner",
          category: "SUV",
          year: 2024,
          fuelType: "DIESEL",
          color: "Grey",
          transmission: "AUTOMATIC",
          price: 55000,
          quantity: 2,
          description: "Toyota Fortuner",
        },
      ],
    });

    const response = await request(app).get("/api/v1/vehicles?search=toyota");

    expect(response.status).toBe(200);

    expect(response.body.vehicles).toHaveLength(2);

    expect(response.body.vehicles[0].make).toBe("Toyota");
    expect(response.body.vehicles[1].make).toBe("Toyota");

    expect(response.body.pagination.total).toBe(2);
  });

  it("should return an empty array when no vehicles match the search term", async () => {
    await prisma.vehicle.create({
      data: {
        make: "Toyota",
        model: "Corolla",
        category: "SEDAN",
        year: 2024,
        fuelType: "PETROL",
        color: "White",
        transmission: "AUTOMATIC",
        price: 25000,
        quantity: 5,
        description: "Toyota Corolla",
      },
    });

    const response = await request(app).get("/api/v1/vehicles?search=bmw");

    expect(response.status).toBe(200);

    expect(response.body.vehicles).toEqual([]);

    expect(response.body.pagination.total).toBe(0);
  });

  it("should filter vehicles by category", async () => {
    const response = await request(app).get("/api/v1/vehicles?category=SUV");

    expect(response.status).toBe(200);

    expect(response.body.vehicles.every((v: any) => v.category === "SUV")).toBe(true);
  });

  it("should filter vehicles by fuel type", async () => {
    const response = await request(app).get("/api/v1/vehicles?fuelType=PETROL");

    expect(response.status).toBe(200);

    expect(response.body.vehicles.every((v: any) => v.fuelType === "PETROL")).toBe(true);
  });

  it("should filter vehicles by transmission", async () => {
    const response = await request(app).get("/api/v1/vehicles?transmission=AUTOMATIC");

    expect(response.status).toBe(200);

    expect(response.body.vehicles.every((v: any) => v.transmission === "AUTOMATIC")).toBe(
      true
    );
  });

  it("should filter vehicles using minimum price", async () => {
    const response = await request(app).get("/api/v1/vehicles?minPrice=30000");

    expect(response.status).toBe(200);

    expect(response.body.vehicles.every((v: any) => v.price >= 30000)).toBe(true);
  });

  it("should filter vehicles using maximum price", async () => {
    const response = await request(app).get("/api/v1/vehicles?maxPrice=30000");

    expect(response.status).toBe(200);

    expect(response.body.vehicles.every((v: any) => v.price <= 30000)).toBe(true);
  });

  it("should combine multiple filters", async () => {
    const response = await request(app).get(
      "/api/v1/vehicles?category=SEDAN&fuelType=PETROL&transmission=AUTOMATIC"
    );

    expect(response.status).toBe(200);

    expect(
      response.body.vehicles.every(
        (v: any) =>
          v.category === "SEDAN" &&
          v.fuelType === "PETROL" &&
          v.transmission === "AUTOMATIC"
      )
    ).toBe(true);
  });
});

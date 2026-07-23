import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";
import { UserRole } from "#/lib/prisma/generated/client";
import { createTestUser, defaultTestVehicleData } from "../../helpers/test-utils";

async function createVehicleRequest(overrides: Partial<typeof defaultTestVehicleData> = {}) {
  const { authHeader } = await createTestUser(UserRole.ADMIN);

  return request(app)
    .post("/api/v1/vehicles")
    .set(authHeader)
    .send({
      ...defaultTestVehicleData,
      ...overrides,
    });
}

describe("POST /api/v1/vehicles", () => {
  it("should create a vehicle when requested by an admin", async () => {
    const response = await createVehicleRequest();

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
    const { authHeader } = await createTestUser(UserRole.USER);

    const response = await request(app)
      .post("/api/v1/vehicles")
      .set(authHeader)
      .send(defaultTestVehicleData);

    expect(response.status).toBe(403);

    const vehicles = await prisma.vehicle.findMany();

    expect(vehicles).toHaveLength(0);
  });

  it("should return 400 when make is missing", async () => {
    const response = await createVehicleRequest({
      make: undefined as any,
    });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      message: "make is required",
    });

    const vehicles = await prisma.vehicle.findMany();

    expect(vehicles).toHaveLength(0);
  });

  it("should return 400 when model is missing", async () => {
    const response = await createVehicleRequest({
      model: undefined as any,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when category is invalid", async () => {
    const response = await createVehicleRequest({
      category: "CAR" as any,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when year is less than 1900", async () => {
    const response = await createVehicleRequest({
      year: 1800,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when fuel type is invalid", async () => {
    const response = await createVehicleRequest({
      fuelType: "GAS" as any,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when color is missing", async () => {
    const response = await createVehicleRequest({
      color: undefined as any,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when transmission is invalid", async () => {
    const response = await createVehicleRequest({
      transmission: "CVT" as any,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when price is less than or equal to zero", async () => {
    const response = await createVehicleRequest({
      price: 0,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when quantity is negative", async () => {
    const response = await createVehicleRequest({
      quantity: -1,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when description is missing", async () => {
    const response = await createVehicleRequest({
      description: undefined as any,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 when imageUrl is missing", async () => {
    const response = await createVehicleRequest({
      imageUrl: undefined as any,
    });

    expect(response.status).toBe(400);
  });
});

import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { prisma } from "#/lib/prisma";
import { generateJwtToken } from "#/lib/jwt";
import app from "#/app";

const defaultVehicle = {
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
};

async function createVehicleRequest(overrides: Partial<typeof defaultVehicle> = {}) {
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: `admin-${Date.now()}-${Math.random()}@test.com`,
      passwordHash: "hashed-password",
      role: "ADMIN",
    },
  });

  const token = generateJwtToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return request(app)
    .post("/api/v1/vehicles")
    .set("Authorization", `Bearer ${token}`)
    .send({
      ...defaultVehicle,
      ...overrides,
    });
}

describe("POST /api/v1/vehicles", () => {
  beforeEach(async () => {
    await prisma.$transaction([
      prisma.purchase.deleteMany(),
      prisma.vehicleImage.deleteMany(),
      prisma.vehicle.deleteMany(),
      prisma.user.deleteMany(),
    ], {
      maxWait: 30000,
      timeout: 30000,
    });
  });

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
      .send(defaultVehicle);

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
});

import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";
import { UserRole } from "#/lib/prisma/generated/client";
import { createTestUser, createTestVehicle } from "../../helpers/test-utils";

describe("POST /api/v1/vehicles/:id/purchase", () => {
  it("should purchase a vehicle", async () => {
    const { user, authHeader } = await createTestUser(UserRole.USER);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/purchase`)
      .set(authHeader)
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
    const { authHeader } = await createTestUser(UserRole.USER);

    const response = await request(app)
      .post("/api/v1/vehicles/non-existent-id/purchase")
      .set(authHeader)
      .send({
        quantity: 1,
      });

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      message: "Vehicle not found",
    });
  });

  it("should return 400 when quantity is less than or equal to zero", async () => {
    const { authHeader } = await createTestUser(UserRole.USER);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/purchase`)
      .set(authHeader)
      .send({
        quantity: 0,
      });

    expect(response.status).toBe(400);
  });

  it("should return 409 when requested quantity exceeds available stock", async () => {
    const { authHeader } = await createTestUser(UserRole.USER);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/purchase`)
      .set(authHeader)
      .send({
        quantity: 100,
      });

    expect(response.status).toBe(409);

    expect(response.body).toMatchObject({
      message: "Insufficient stock",
    });
  });
});

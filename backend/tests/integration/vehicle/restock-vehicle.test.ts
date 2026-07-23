import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";
import { UserRole } from "#/lib/prisma/generated/client";
import { createTestUser, createTestVehicle } from "../../helpers/test-utils";

describe("POST /api/v1/vehicles/:id/restock", () => {
  it("should restock a vehicle", async () => {
    const { authHeader } = await createTestUser(UserRole.ADMIN);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/restock`)
      .set(authHeader)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      message: "Vehicle restocked successfully",
    });

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicle.id,
      },
    });

    expect(updatedVehicle?.quantity).toBe(15);
  });

  it("should return 404 when vehicle does not exist", async () => {
    const { authHeader } = await createTestUser(UserRole.ADMIN);

    const response = await request(app)
      .post("/api/v1/vehicles/non-existent-id/restock")
      .set(authHeader)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      message: "Vehicle not found",
    });
  });

  it("should return 400 when quantity is less than or equal to zero", async () => {
    const { authHeader } = await createTestUser(UserRole.ADMIN);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/restock`)
      .set(authHeader)
      .send({
        quantity: 0,
      });

    expect(response.status).toBe(400);
  });

  it("should return 403 when non-admin restocks a vehicle", async () => {
    const { authHeader } = await createTestUser(UserRole.USER);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .post(`/api/v1/vehicles/${vehicle.id}/restock`)
      .set(authHeader)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(403);

    expect(response.body).toMatchObject({
      message: "Forbidden",
    });
  });
});

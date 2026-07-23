import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";
import { UserRole } from "#/lib/prisma/generated/client";
import { createTestUser, createTestVehicle } from "../../helpers/test-utils";

describe("DELETE /api/v1/vehicles/:id", () => {
  it("should delete a vehicle", async () => {
    const { authHeader } = await createTestUser(UserRole.ADMIN);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .delete(`/api/v1/vehicles/${vehicle.id}`)
      .set(authHeader);

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
    const { authHeader } = await createTestUser(UserRole.ADMIN);

    const response = await request(app)
      .delete("/api/v1/vehicles/non-existent-id")
      .set(authHeader);

    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      message: "Vehicle not found",
    });
  });

  it("should return 403 when a non-admin deletes a vehicle", async () => {
    const { authHeader } = await createTestUser(UserRole.USER);
    const vehicle = await createTestVehicle();

    const response = await request(app)
      .delete(`/api/v1/vehicles/${vehicle.id}`)
      .set(authHeader);

    expect(response.status).toBe(403);

    expect(response.body).toMatchObject({
      message: "Forbidden",
    });
  });

  it("should return 409 when deleting a vehicle with purchase history", async () => {
    const { user } = await createTestUser(UserRole.USER);
    const { authHeader: adminAuthHeader } = await createTestUser(UserRole.ADMIN);

    const vehicle = await createTestVehicle();

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
      .set(adminAuthHeader);

    expect(response.status).toBe(409);

    expect(response.body).toMatchObject({
      message: "Vehicle cannot be deleted because it has purchase history",
    });
  });
});

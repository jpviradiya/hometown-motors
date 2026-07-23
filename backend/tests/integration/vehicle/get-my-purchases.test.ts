import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "#/app";
import { prisma } from "#/lib/prisma";
import { UserRole } from "#/lib/prisma/generated/client";
import { createTestUser, createTestVehicle } from "../../helpers/test-utils";

describe("GET /api/v1/purchases/me", () => {
  it("should return the authenticated user's purchases", async () => {
    const { user, authHeader } = await createTestUser(UserRole.USER);
    const { user: anotherUser } = await createTestUser(UserRole.USER);

    const vehicle = await createTestVehicle();

    await prisma.purchase.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        quantity: 2,
        purchasePrice: 25000,
      },
    });

    await prisma.purchase.create({
      data: {
        userId: anotherUser.id,
        vehicleId: vehicle.id,
        quantity: 1,
        purchasePrice: 25000,
      },
    });

    const response = await request(app)
      .get("/api/v1/purchases/me")
      .set(authHeader);

    expect(response.status).toBe(200);

    expect(response.body.purchases).toHaveLength(1);

    expect(response.body.purchases[0]).toMatchObject({
      quantity: 2,
      purchasePrice: "25000",
      vehicle: {
        make: "Toyota",
        model: "Corolla",
      },
    });
  });
});

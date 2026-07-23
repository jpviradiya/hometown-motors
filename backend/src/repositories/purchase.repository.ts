import { prisma } from "#/lib/prisma";
import { Prisma } from "#/lib/prisma/generated/client";

export type PurchaseWithVehicle = Prisma.PurchaseGetPayload<{
  include: { vehicle: true };
}>;

export class PurchaseRepository {
  // Retrieve purchase history for a specific user ordered by purchase date descending.
  async findByUser(userId: string): Promise<PurchaseWithVehicle[]> {
    return prisma.purchase.findMany({
      where: { userId },
      include: { vehicle: true },
      orderBy: { purchasedAt: "desc" },
    });
  }
}

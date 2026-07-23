import { prisma } from "#/lib/prisma";

export class PurchaseRepository {
  async findByUser(userId: string) {
    return prisma.purchase.findMany({
      where: {
        userId,
      },
      include: {
        vehicle: true,
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });
  }
}

import { PurchaseRepository } from "#/repositories";

export class PurchaseService {
  constructor(private readonly repository = new PurchaseRepository()) {}

  // Fetch purchase history scoped strictly to the requesting user.
  async getMyPurchases(userId: string) {
    return this.repository.findByUser(userId);
  }
}

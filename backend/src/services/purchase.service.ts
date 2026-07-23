import { PurchaseRepository } from "#/repositories";

export class PurchaseService {
  constructor(private readonly repository = new PurchaseRepository()) {}

  async getMyPurchases(userId: string) {
    return this.repository.findByUser(userId);
  }
}

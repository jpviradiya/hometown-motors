import { asyncHandler } from "#/lib/async-handler";
import { PurchaseService } from "#/services";

const service = new PurchaseService();

export const getMyPurchases = asyncHandler(async (req, res) => {
  const purchases = await service.getMyPurchases(req.user!.id);

  res.status(200).json({
    purchases,
  });
});

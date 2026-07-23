import { Request, Response } from "express";
import { asyncHandler } from "#/lib/async-handler";
import { PurchaseService } from "#/services";

const service = new PurchaseService();

export const getMyPurchases = asyncHandler(async (req: Request, res: Response) => {
  const purchases = await service.getMyPurchases(req.user!.id);

  return res.status(200).json({
    purchases,
  });
});

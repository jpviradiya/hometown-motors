import { Router } from "express";

import { getMyPurchases } from "#/controllers";
import { authenticate } from "#/middleware";

const purchaseRouter = Router();

purchaseRouter.get("/me", authenticate, getMyPurchases);

export { purchaseRouter };

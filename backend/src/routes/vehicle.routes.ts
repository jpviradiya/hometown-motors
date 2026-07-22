import { Router } from "express";

import { createVehicle } from "#/controllers";
import { authenticate, authorize } from "#/middleware";

const vehicleRouter = Router();

vehicleRouter.post("/", authenticate, authorize("ADMIN"), createVehicle);

export { vehicleRouter };

import { Router } from "express";

import { createVehicle, getVehicleById, getVehicles } from "#/controllers";
import { authenticate, authorize } from "#/middleware";

const vehicleRouter = Router();

vehicleRouter.post("/", authenticate, authorize("ADMIN"), createVehicle);
vehicleRouter.get("/", getVehicles);
vehicleRouter.get("/:id", getVehicleById);

export { vehicleRouter };

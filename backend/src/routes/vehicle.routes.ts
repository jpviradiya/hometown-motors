import { Router } from "express";

import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  getVehicles,
  purchaseVehicle,
  updateVehicle,
} from "#/controllers";
import { authenticate, authorize } from "#/middleware";

const vehicleRouter = Router();

vehicleRouter.post("/", authenticate, authorize("ADMIN"), createVehicle);
vehicleRouter.get("/", getVehicles);
vehicleRouter.get("/:id", getVehicleById);
vehicleRouter.patch("/:id", authenticate, authorize("ADMIN"), updateVehicle);
vehicleRouter.delete("/:id", authenticate, authorize("ADMIN"), deleteVehicle);
vehicleRouter.post("/:id/purchase", authenticate, purchaseVehicle);

export { vehicleRouter };

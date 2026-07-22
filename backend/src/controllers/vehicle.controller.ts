import { Request, Response } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { VehicleService } from "#/services";

const service = new VehicleService();

export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await service.createVehicle(req.body);

  res.status(201).json({
    message: "Vehicle created successfully",
    vehicle,
  });
});

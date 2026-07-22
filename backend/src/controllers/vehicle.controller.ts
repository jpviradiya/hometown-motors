import { Request, Response } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { VehicleService } from "#/services";
import { createVehicleSchema } from "#/validators";

const service = new VehicleService();

export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createVehicleSchema.parse(req.body);

  const vehicle = await service.createVehicle(validatedData);
  res.status(201).json({
    message: "Vehicle created successfully",
    vehicle,
  });
});

export const getVehicles = asyncHandler(async (_req, res) => {
  const vehicles = await service.getVehicles();

  res.status(200).json({
    vehicles,
  });
});

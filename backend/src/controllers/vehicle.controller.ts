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

export const getVehicles = asyncHandler(async (req, res) => {
  if (req.query.page || req.query.limit) {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const result = await service.getPaginatedVehicles(page, limit);
    return res.status(200).json(result);
  }

  const vehicles = await service.getVehicles();
  return res.status(200).json({ vehicles });
});

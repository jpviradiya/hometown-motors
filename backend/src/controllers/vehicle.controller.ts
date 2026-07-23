import { Request, Response } from "express";
import { NotFoundError } from "#/errors";
import { asyncHandler } from "#/lib/async-handler";
import { VehicleService } from "#/services";
import { FilterVehicleDto } from "#/types/vehicle.types";
import { createVehicleSchema, updateVehicleSchema } from "#/validators";
import { purchaseSchema } from "#/validators/purchase.validator";
import { restockSchema } from "#/validators/restock.validator";

const service = new VehicleService();

function getParamId(req: Request): string {
  const { id } = req.params;
  if (typeof id !== "string" || !id) {
    throw new NotFoundError("Vehicle not found");
  }
  return id;
}

export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createVehicleSchema.parse(req.body);
  const vehicle = await service.createVehicle(validatedData);

  return res.status(201).json({
    message: "Vehicle created successfully",
    vehicle,
  });
});

export const getVehicles = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  const filters: FilterVehicleDto = {
    ...(typeof req.query.search === "string" && { search: req.query.search }),
    ...(typeof req.query.category === "string" && { category: req.query.category }),
    ...(typeof req.query.fuelType === "string" && { fuelType: req.query.fuelType }),
    ...(typeof req.query.transmission === "string" && { transmission: req.query.transmission }),
    ...(req.query.minPrice ? { minPrice: Number(req.query.minPrice) } : {}),
    ...(req.query.maxPrice ? { maxPrice: Number(req.query.maxPrice) } : {}),
    ...(typeof req.query.sort === "string" && { sort: req.query.sort }),
  };

  const result = await service.getPaginatedVehicles(page, limit, filters);
  return res.status(200).json(result);
});

export const getVehicleById = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamId(req);
  const vehicle = await service.getVehicleById(id);

  if (!vehicle) {
    throw new NotFoundError("Vehicle not found");
  }

  return res.status(200).json({
    vehicle,
  });
});

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamId(req);
  const data = updateVehicleSchema.parse(req.body);
  const vehicle = await service.updateVehicle(id, data);

  return res.status(200).json({
    message: "Vehicle updated successfully",
    vehicle,
  });
});

export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamId(req);
  await service.deleteVehicle(id);

  return res.status(200).json({
    message: "Vehicle deleted successfully",
  });
});

export const purchaseVehicle = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamId(req);
  const { quantity } = purchaseSchema.parse(req.body);

  await service.purchaseVehicle(id, req.user!.id, quantity);

  return res.status(201).json({
    message: "Vehicle purchased successfully",
  });
});

export const restockVehicle = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamId(req);
  const { quantity } = restockSchema.parse(req.body);

  await service.restockVehicle(id, quantity);

  return res.status(200).json({
    message: "Vehicle restocked successfully",
  });
});

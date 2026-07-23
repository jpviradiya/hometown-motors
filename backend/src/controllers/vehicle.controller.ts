import { Request, Response } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { VehicleService } from "#/services";
import { createVehicleSchema, updateVehicleSchema } from "#/validators";
import { NotFoundError } from "#/errors";

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
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const filters = {
    ...(typeof req.query.search === "string" && { search: req.query.search }),
    ...(typeof req.query.category === "string" && { category: req.query.category }),
    ...(typeof req.query.fuelType === "string" && { fuelType: req.query.fuelType }),
    ...(typeof req.query.transmission === "string" && {
      transmission: req.query.transmission,
    }),
    ...(req.query.minPrice ? { minPrice: Number(req.query.minPrice) } : {}),
    ...(req.query.maxPrice ? { maxPrice: Number(req.query.maxPrice) } : {}),
    ...(typeof req.query.sort === "string" && { sort: req.query.sort }),
  };

  const result = await service.getPaginatedVehicles(page, limit, filters);

  res.status(200).json(result);
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new NotFoundError("Vehicle not found");
  }

  const vehicle = await service.getVehicleById(id);
  if (!vehicle) {
    throw new NotFoundError("Vehicle not found");
  }

  res.status(200).json({
    vehicle,
  });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new NotFoundError("Vehicle not found");
  }
  
  const data = updateVehicleSchema.parse(req.body);
  const vehicle = await service.updateVehicle(id, data as any);

  res.status(200).json({
    message: "Vehicle updated successfully",
    vehicle,
  });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new NotFoundError("Vehicle not found");
  }

  await service.deleteVehicle(id);

  res.status(200).json({
    message: "Vehicle deleted successfully",
  });
});

export const purchaseVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new NotFoundError("Vehicle not found");
  }

  const { quantity } = req.body;

  await service.purchaseVehicle(id, req.user!.id, quantity);

  res.status(201).json({
    message: "Vehicle purchased successfully",
  });
});
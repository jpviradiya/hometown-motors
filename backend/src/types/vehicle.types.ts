import { FuelType, Transmission, VehicleCategory } from "#/lib/prisma/generated/client";

export interface CreateVehicleDto {
  make: string;
  model: string;
  category: VehicleCategory;
  year: number;
  fuelType: FuelType;
  color: string;
  transmission: Transmission;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

export interface UpdateVehicleDto {
  make?: string | undefined;
  model?: string | undefined;
  category?: VehicleCategory | undefined;
  year?: number | undefined;
  fuelType?: FuelType | undefined;
  color?: string | undefined;
  transmission?: Transmission | undefined;
  price?: number | undefined;
  quantity?: number | undefined;
  description?: string | undefined;
  imageUrl?: string | undefined;
}

export interface FilterVehicleDto {
  search?: string | undefined;
  category?: VehicleCategory | string | undefined;
  fuelType?: FuelType | string | undefined;
  transmission?: Transmission | string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  sort?: string | undefined;
}

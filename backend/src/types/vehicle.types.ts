import { FuelType, Transmission, VehicleCategory } from "#/lib/prisma/generated/enums";

export interface UpdateVehicleDto {
  make?: string;
  model?: string;
  category?: VehicleCategory;
  year?: number;
  fuelType?: FuelType;
  color?: string;
  transmission?: Transmission;
  price?: number;
  quantity?: number;
  description?: string;
}

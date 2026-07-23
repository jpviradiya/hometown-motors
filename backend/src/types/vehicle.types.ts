import { FuelType, Transmission, VehicleCategory } from "#/lib/prisma/generated/enums";

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
}

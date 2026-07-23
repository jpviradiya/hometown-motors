export type VehicleCategory =
  | "SEDAN"
  | "SUV"
  | "HATCHBACK"
  | "COUPE"
  | "CONVERTIBLE"
  | "WAGON"
  | "PICKUP"
  | "VAN";

export type FuelType = "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC" | "CNG";

export type Transmission = "MANUAL" | "AUTOMATIC";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: VehicleCategory;
  year: number;
  fuelType: FuelType;
  color: string;
  transmission: Transmission;
  price: number | string;
  quantity: number;
  description?: string | null;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedVehiclesResponse {
  vehicles: Vehicle[];
  pagination: PaginationMeta;
}

export interface VehicleFilterOptions {
  search?: string;
  category?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  availability?: "all" | "in_stock";
}

export interface PurchaseRequest {
  quantity: number;
}

export interface PurchaseResponse {
  message: string;
}

export interface CreateVehicleInput {
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

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

import api from "./axios";
import type {
  Vehicle,
  PaginatedVehiclesResponse,
  VehicleFilterOptions,
  PurchaseResponse,
  CreateVehicleInput,
  UpdateVehicleInput,
} from "../types/vehicle";

/**
 * Fetches paginated vehicle catalog with optional search, filters, and sorting.
 */
export const getVehicles = async (
  params?: VehicleFilterOptions
): Promise<PaginatedVehiclesResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params?.search) queryParams.search = params.search;
  if (params?.category && params.category !== "ALL") queryParams.category = params.category;
  if (params?.fuelType && params.fuelType !== "ALL") queryParams.fuelType = params.fuelType;
  if (params?.transmission && params.transmission !== "ALL") queryParams.transmission = params.transmission;
  if (params?.minPrice !== undefined && params.minPrice > 0) queryParams.minPrice = params.minPrice;
  if (params?.maxPrice !== undefined && params.maxPrice > 0) queryParams.maxPrice = params.maxPrice;
  if (params?.sort) queryParams.sort = params.sort;
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  const response = await api.get<PaginatedVehiclesResponse>("/vehicles", {
    params: queryParams,
  });

  return response.data;
};

/**
 * Fetches single vehicle details by ID.
 */
export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await api.get<{ vehicle: Vehicle }>(`/vehicles/${id}`);
  return response.data.vehicle;
};

/**
 * Purchases specified quantity of a vehicle.
 */
export const purchaseVehicle = async (
  vehicleId: string,
  quantity: number
): Promise<PurchaseResponse> => {
  const response = await api.post<PurchaseResponse>(`/vehicles/${vehicleId}/purchase`, {
    quantity,
  });
  return response.data;
};

/**
 * Admin: Restocks vehicle inventory by adding specified quantity.
 */
export const restockVehicle = async (
  vehicleId: string,
  quantity: number
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/vehicles/${vehicleId}/restock`, {
    quantity,
  });
  return response.data;
};

/**
 * Admin: Creates a new vehicle entry in the inventory.
 */
export const createVehicle = async (
  data: CreateVehicleInput
): Promise<{ message: string; vehicle: Vehicle }> => {
  const response = await api.post<{ message: string; vehicle: Vehicle }>("/vehicles", data);
  return response.data;
};

/**
 * Admin: Updates an existing vehicle's specifications or inventory count.
 */
export const updateVehicle = async (
  vehicleId: string,
  data: UpdateVehicleInput
): Promise<{ message: string; vehicle: Vehicle }> => {
  const response = await api.patch<{ message: string; vehicle: Vehicle }>(
    `/vehicles/${vehicleId}`,
    data
  );
  return response.data;
};

/**
 * Admin: Deletes a vehicle from inventory.
 */
export const deleteVehicle = async (
  vehicleId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/vehicles/${vehicleId}`);
  return response.data;
};

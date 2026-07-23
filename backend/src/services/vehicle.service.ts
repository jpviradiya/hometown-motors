import { ConflictError, NotFoundError } from "#/errors";
import { VehicleRepository } from "#/repositories";
import { CreateVehicleDto, FilterVehicleDto, UpdateVehicleDto } from "#/types/vehicle.types";

export class VehicleService {
  constructor(private readonly repository = new VehicleRepository()) {}

  async createVehicle(data: CreateVehicleDto) {
    return this.repository.create(data);
  }

  async getVehicles() {
    return this.repository.findAll();
  }

  async getPaginatedVehicles(page: number, limit: number, filters: FilterVehicleDto) {
    const { vehicles, total } = await this.repository.findPaginated(page, limit, filters);

    return {
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVehicleById(id: string) {
    return this.repository.findById(id);
  }

  async updateVehicle(id: string, data: UpdateVehicleDto) {
    const exists = await this.repository.exists(id);

    if (!exists) {
      throw new NotFoundError("Vehicle not found");
    }

    return this.repository.update(id, data);
  }

  // Prevent deletion of vehicles with purchase records to preserve historical audit logs.
  async deleteVehicle(id: string): Promise<void> {
    const exists = await this.repository.exists(id);

    if (!exists) {
      throw new NotFoundError("Vehicle not found");
    }

    const hasPurchases = await this.repository.hasPurchases(id);

    if (hasPurchases) {
      throw new ConflictError(
        "Vehicle cannot be deleted because it has purchase history"
      );
    }

    await this.repository.delete(id);
  }

  // Prevent overselling by validating stock availability before processing purchase.
  async purchaseVehicle(vehicleId: string, userId: string, quantity: number): Promise<void> {
    const vehicle = await this.repository.findById(vehicleId);

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    if (quantity > vehicle.quantity) {
      throw new ConflictError("Insufficient stock");
    }

    await this.repository.purchaseVehicle({
      userId,
      vehicleId: vehicle.id,
      quantity,
      purchasePrice: Number(vehicle.price),
    });
  }

  async restockVehicle(vehicleId: string, quantity: number) {
    const vehicle = await this.repository.findById(vehicleId);

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    return this.repository.increaseStock(vehicleId, quantity);
  }
}

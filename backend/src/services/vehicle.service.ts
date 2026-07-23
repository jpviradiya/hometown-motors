import { ConflictError, NotFoundError } from "#/errors";
import { VehicleRepository } from "#/repositories";
import { UpdateVehicleDto } from "#/types/vehicle.types";

export class VehicleService {
  constructor(private readonly repository = new VehicleRepository()) {}

  async createVehicle(data: any) {
    return this.repository.create(data);
  }

  async getVehicles() {
    return this.repository.findAll();
  }

  async getPaginatedVehicles(page: number, limit: number, filters: FilterVehicle) {
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

  async deleteVehicle(id: string) {
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

  async purchaseVehicle(vehicleId: string, userId: string, quantity: number) {
    const vehicle = await this.repository.findById(vehicleId);

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    await this.repository.createPurchase({
      userId,
      vehicleId,
      quantity,
      purchasePrice: Number(vehicle.price),
    });

    await this.repository.decreaseStock(vehicleId, quantity);
  }
}

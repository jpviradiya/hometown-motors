import { VehicleRepository } from "#/repositories";

export class VehicleService {
  constructor(private readonly repository = new VehicleRepository()) {}

  async createVehicle(data: any) {
    return this.repository.create(data);
  }

  async getVehicles() {
    return this.repository.findAll();
  }

  async getPaginatedVehicles(page: number, limit: number) {
    const { vehicles, total } = await this.repository.findPaginated(page, limit);

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
}

import { VehicleRepository } from "#/repositories";

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
}

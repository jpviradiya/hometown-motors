import { VehicleRepository } from "#/repositories";

export class VehicleService {
  constructor(private readonly repository = new VehicleRepository()) {}

  createVehicle(data: any) {
    return this.repository.create(data);
  }
}

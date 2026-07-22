import { prisma } from "#/lib/prisma";
type Vehicle = {
  make: string;
  model: string;
  category: any;
  year: number;
  fuelType: any;
  color: string;
  transmission: any;
  price: number;
  quantity: number;
  description: string;
};

export class VehicleRepository {
  async create(data: Vehicle) {
    return prisma.vehicle.create({
      data,
    });
  }

  async findAll() {
    return prisma.vehicle.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

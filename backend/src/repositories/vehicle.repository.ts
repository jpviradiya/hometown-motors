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
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  }

  async findPaginated(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              make: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              model: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.vehicle.count({
        where,
      }),
    ]);

    return {
      vehicles,
      total,
    };
  }
}

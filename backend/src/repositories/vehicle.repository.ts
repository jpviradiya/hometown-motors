import { prisma } from "#/lib/prisma";

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

  async findPaginated(page: number, limit: number, filters: FilterVehicle) {
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.search && {
        OR: [
          {
            make: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            model: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),

      ...(filters.category && {
        category: filters.category as any,
      }),

      ...(filters.fuelType && {
        fuelType: filters.fuelType as any,
      }),

      ...(filters.transmission && {
        transmission: filters.transmission as any,
      }),

      ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
        price: {
          ...(filters.minPrice !== undefined && {
            gte: filters.minPrice,
          }),
          ...(filters.maxPrice !== undefined && {
            lte: filters.maxPrice,
          }),
        },
      }),
    };

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

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: {
        id,
      },
    });
  }
}

import { prisma } from "#/lib/prisma";
import { CreatePurchaseDto } from "#/types/purchase.types";
import { UpdateVehicleDto } from "#/types/vehicle.types";

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

    let orderBy: any = { createdAt: "asc" };
    if (filters.sort) {
      const isDescending = filters.sort.startsWith("-");
      const fieldName = isDescending ? filters.sort.substring(1) : filters.sort;
      if (["price", "year", "createdAt"].includes(fieldName)) {
        orderBy = {
          [fieldName]: isDescending ? "desc" : "asc",
        };
      }
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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

  async update(id: string, data: UpdateVehicleDto) {
    return prisma.vehicle.update({
      where: { id },
      data: data as any,
    });
  }

  async exists(id: string): Promise<boolean> {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return vehicle !== null;
  }

  async delete(id: string) {
    return prisma.vehicle.delete({
      where: {
        id,
      },
    });
  }

  async hasPurchases(id: string) {
    const count = await prisma.purchase.count({
      where: {
        vehicleId: id,
      },
    });

    return count > 0;
  }

  async createPurchase(data: {
    userId: string;
    vehicleId: string;
    quantity: number;
    purchasePrice: number;
  }) {
    return prisma.purchase.create({
      data,
    });
  }

  async decreaseStock(id: string, quantity: number) {
    return prisma.vehicle.update({
      where: {
        id,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  async purchaseVehicle(data: CreatePurchaseDto) {
    return prisma.$transaction(async (tx) => {
      await tx.purchase.create({
        data: {
          userId: data.userId,
          vehicleId: data.vehicleId,
          quantity: data.quantity,
          purchasePrice: data.purchasePrice,
        },
      });

      await tx.vehicle.update({
        where: {
          id: data.vehicleId,
        },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });
    });
  }

  async increaseStock(vehicleId: string, quantity: number) {
    return prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }

  
}

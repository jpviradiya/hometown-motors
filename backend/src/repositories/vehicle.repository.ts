import { prisma } from "#/lib/prisma";
import {
  FuelType,
  Prisma,
  Transmission,
  Vehicle,
  VehicleCategory,
} from "#/lib/prisma/generated/client";
import { CreatePurchaseDto } from "#/types/purchase.types";
import { CreateVehicleDto, FilterVehicleDto, UpdateVehicleDto } from "#/types/vehicle.types";

export class VehicleRepository {
  async create(data: CreateVehicleDto): Promise<Vehicle> {
    return prisma.vehicle.create({
      data,
    });
  }

  async findAll(): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  }

  async findPaginated(
    page: number,
    limit: number,
    filters: FilterVehicleDto
  ): Promise<{ vehicles: Vehicle[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.VehicleWhereInput = {
      ...(filters.search && {
        OR: [
          {
            make: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            model: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(filters.category && {
        category: filters.category as VehicleCategory,
      }),

      ...(filters.fuelType && {
        fuelType: filters.fuelType as FuelType,
      }),

      ...(filters.transmission && {
        transmission: filters.transmission as Transmission,
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

    let orderBy: Prisma.VehicleOrderByWithRelationInput = { createdAt: "asc" };
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

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateVehicleDto): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data: data as Prisma.VehicleUpdateInput,
    });
  }

  async exists(id: string): Promise<boolean> {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: { id: true },
    });

    return vehicle !== null;
  }

  async delete(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({
      where: { id },
    });
  }

  async hasPurchases(id: string): Promise<boolean> {
    const count = await prisma.purchase.count({
      where: { vehicleId: id },
    });

    return count > 0;
  }

  // Execute purchase creation and stock decrement atomically to prevent inconsistent inventory state.
  async purchaseVehicle(data: CreatePurchaseDto): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.purchase.create({
        data: {
          userId: data.userId,
          vehicleId: data.vehicleId,
          quantity: data.quantity,
          purchasePrice: data.purchasePrice,
        },
      });

      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });
    });
  }

  async increaseStock(vehicleId: string, quantity: number): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }
}

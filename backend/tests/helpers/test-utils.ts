import { generateJwtToken } from "#/lib/jwt";
import { prisma } from "#/lib/prisma";
import { UserRole, VehicleCategory, FuelType, Transmission } from "#/lib/prisma/generated/client";

export const defaultTestVehicleData = {
  make: "Toyota",
  model: "Corolla",
  category: VehicleCategory.SEDAN,
  year: 2024,
  fuelType: FuelType.PETROL,
  color: "White",
  transmission: Transmission.AUTOMATIC,
  price: 25000,
  quantity: 10,
  description: "Reliable family sedan",
  imageUrl: "https://example.com/car.jpg",
};

export async function createTestUser(role: UserRole = UserRole.USER, emailPrefix = role.toLowerCase()) {
  const email = `${emailPrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@test.com`;

  const user = await prisma.user.create({
    data: {
      name: role === UserRole.ADMIN ? "Admin User" : "Regular User",
      email,
      passwordHash: "hashed-password",
      role,
    },
  });

  const token = generateJwtToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
    authHeader: { Authorization: `Bearer ${token}` },
  };
}

export async function createTestVehicle(overrides = {}) {
  return prisma.vehicle.create({
    data: {
      ...defaultTestVehicleData,
      ...overrides,
    },
  });
}

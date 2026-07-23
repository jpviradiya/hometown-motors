import { prisma } from "#/lib/prisma";
import { User } from "#/lib/prisma/generated/client";

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}

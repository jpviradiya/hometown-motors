import { prisma } from "#/lib/prisma";
type User = {
  name: string;
  email: string;
  passwordHash: string;
};

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(user: User) {
    return prisma.user.create({ data: user });
  }
}

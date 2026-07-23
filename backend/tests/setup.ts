import "dotenv/config";
import { afterEach, beforeEach, afterAll } from "vitest";
import { prisma } from "#/lib/prisma";

beforeEach(async () => {
  await prisma.purchase.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
});

afterEach(() => {
  // cleanup will go here later
});

afterAll(async () => {
  await prisma.$disconnect();
});

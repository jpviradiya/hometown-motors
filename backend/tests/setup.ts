import { afterEach, beforeEach } from "vitest";
import { prisma } from "#/lib/prisma";

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterEach(() => {
  // cleanup will go here later
});

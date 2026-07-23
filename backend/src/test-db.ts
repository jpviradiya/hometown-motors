import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection successful!");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Database connection failed:", message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

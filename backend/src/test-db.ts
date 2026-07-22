import { prisma } from "./lib/prisma";

async function main() {
  try {
    // Attempt to query the database (e.g., list all tables or a simple query)
    await prisma.$connect();
    console.log(" Database connection successful!");

    // Optional: Fetch a simple count or records to confirm read/write capability
    // const userCount = await prisma.user.count();
    // console.log(`Number of users: ${userCount}`);
  } catch (error:any) {
    console.error("❌ Database connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

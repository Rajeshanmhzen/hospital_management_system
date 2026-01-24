import { PrismaClient } from "../../node_modules/.prisma/master-client";

export const prisma = new PrismaClient();

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

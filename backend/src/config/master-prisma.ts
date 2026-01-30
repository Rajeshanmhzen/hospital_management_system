import { PrismaClient } from '@prisma/master-client';

export const masterPrisma = new PrismaClient();

export default masterPrisma;
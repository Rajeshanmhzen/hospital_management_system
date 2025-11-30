import { PrismaClient } from '../../node_modules/.prisma/master-client';

export const masterPrisma = new PrismaClient();

export default masterPrisma;
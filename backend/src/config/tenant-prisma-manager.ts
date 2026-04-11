import { TenantPrismaClient } from "../../prisma/tenant/client";

const clients = new Map<string, any>();

export const getTenantPrismaClient = (dbUrl: string): any => {
  const existing = clients.get(dbUrl);
  if (existing) {
    return existing;
  }

  const client = new TenantPrismaClient({
    datasources: { db: { url: dbUrl } },
  });
  clients.set(dbUrl, client);
  return client;
};

export const disconnectAllTenantClients = async () => {
  const promises = Array.from(clients.values()).map((client) => client.$disconnect());
  await Promise.allSettled(promises);
  clients.clear();
};

import { tenantPrisma } from '../../prisma/tenant/client';
import { UserRole } from "../utils/userRoles";

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  const user = await tenantPrisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  return user?.role[0]?.role as UserRole ?? null;
};

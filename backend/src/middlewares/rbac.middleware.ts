// import { PrismaClient } from "../node_modules/.prisma/tenant-client";
import { PrismaClient } from "../../node_modules/.prisma/tenant-client";

const prisma = new PrismaClient();

export const rbac =
  (allowedRoles: string[]) =>
  async (req: any, res: any, next: any) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      const userId = req.user.id;

      const roles = await prisma.userRoleMapping.findMany({
        where: { userId },
        select: { role: true },
      });

      if (!roles.length) {
        return res.status(403).json({ message: "No roles assigned" });
      }

      const userRoles = roles.map((r:any) => r.role);

      const hasPermission = allowedRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user.roles = userRoles;

      next();
    } catch (error) {
      console.error("RBAC error:", error);
      res.status(500).json({ message: "RBAC failure" });
    }
  };

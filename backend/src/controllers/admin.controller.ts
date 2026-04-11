import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { sendSuccess } from "../utils/apiResponse.util";

export class AdminController {
    private service = new adminService();

    createUser = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.createUser(req.prisma, req.body);
        return sendSuccess(res, "User created successfully", result, 201);
    });

    listUser = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.listUser(req.prisma, req.query);
        return sendSuccess(res, "Users listed successfully", result);
    });

    listUserByRole = asyncHandler(async (req: Request, res: Response) => {
        const { role } = req.params;
        if (role == "superAdmin") throw new Error("You are not authorized to perform this action");
        const result = await this.service.listUserByRole(req.prisma, role as any);
        return sendSuccess(res, `Users with role ${role} listed successfully`, result);
    });

    detailUser = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.detailUser(req.prisma, req.params.id);
        return sendSuccess(res, "User details retrieved", result);
    });

    editUser = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.editUser(req.prisma, req.params.id, req.body);
        return sendSuccess(res, "User updated successfully", result);
    });

    editRole = asyncHandler(async (req: Request, res: Response) => {
        const { role } = req.body;
        if (role == "superAdmin") throw new Error("You are not authorized to perform this action");
        const result = await this.service.editRole(req.prisma, req.params.id, role);
        return sendSuccess(res, "User role updated successfully", result);
    });

    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const { role } = req.body;
        if (role == "superAdmin") throw new Error("You are not authorized to perform this action");
        const result = await this.service.deleteUser(req.prisma, req.params.id);
        return sendSuccess(res, "User deleted successfully", result);
    });
}
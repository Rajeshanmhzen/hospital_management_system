import { Request, Response } from "express";
import { SuperAdminService } from '../services/superAdmin.service';
import { sendSuccess } from "../utils/apiResponse.util";
import { asyncHandler } from "@/utils/asyncHandler.utils";

export class SuperAdminController {
    private superAdminService = new SuperAdminService();

    addSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body;
        const result = await this.superAdminService.addSuperAdmin(data);

        res.status(201).json({
            success: true,
            message: "Super admin added successfully",
            data: result
        })
    });

    deleteSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.superAdminService.deleteSuperAdmin(id);
        res.status(200).json({
            success: true,
            message: "Super admin deleted successfully",
            data: result
        });
    });

    editSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const data = req.body;
        const result = await this.superAdminService.editSuperAdmin(id, data);

        res.status(200).json({
            success: true,
            message: "Super admin edited successfully",
            data: result
        });
    });

    addTenant = asyncHandler(async (req: Request, res: Response) => {
        const tenantData = req.body;

        const result = await this.superAdminService.addTenant(tenantData);
        res.status(201).json({
            success: true,
            message: "Tenant added successfully",
            data: result
        });
    });

    listTenant = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.superAdminService.listTenant(req.query);
        return sendSuccess(res, "Tenants listed successfully", result.data, 200, result.meta);
    });

    editTenant = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const data = req.body;

        const result = await this.superAdminService.editTenant(id, data);
        res.status(200).json({
            success: true,
            message: "Tenant edited successfully",
            data: result
        });
    });

    deleteTenant = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.superAdminService.deleteTenant(id);
        res.status(200).json({
            success: true,
            message: "Tenant deleted successfully",
            data: result
        });
    });

    detailTenant = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Id is required"
            });
        };
        const findTenant = await this.superAdminService.detailTenant(id);
        return res.status(200).json({
            success: true,
            message: "Tenant detailed successfully",
            data: findTenant
        });
    });

    getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.superAdminService.getDashboardStats();
        res.status(200).json({
            success: true,
            data: result
        });
    });

    editTenantStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        const result = await this.superAdminService.editTenantStatus(id, status);
        res.status(200).json({
            success: true,
            message: "Status updated successfully",
        });
    });
};
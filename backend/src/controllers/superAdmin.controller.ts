import { Request, Response } from "express";
import { SuperAdminService } from '../services/superAdmin.service';
import { sendSuccess } from "../utils/apiResponse.util";

export class SuperAdminController {
    private superAdminService = new SuperAdminService();

    addSuperAdmin = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const result = await this.superAdminService.addSuperAdmin(data);

            res.status(201).json({
                success: true,
                message: "Super admin added successfully",
                data: result
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        };
    };

    deleteSuperAdmin = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = await this.superAdminService.deleteSuperAdmin(id);
            res.status(200).json({
                success: true,
                message: "Super admin deleted successfully",
                data: result
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        };
    };

    editSuperAdmin = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const result = await this.superAdminService.editSuperAdmin(id, data);

            res.status(200).json({
                success: true,
                message: "Super admin edited successfully",
                data: result
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        };
    };

    addTenant = async (req: Request, res: Response) => {
        try {
            const tenantData = req.body;

            const result = await this.superAdminService.addTenant(tenantData);
            res.status(201).json({
                success: true,
                message: "Tenant added successfully",
                data: result
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        };
    };

    listTenant = async (req: Request, res: Response) => {
        try {
            const result = await this.superAdminService.listTenant(req.query);
            return sendSuccess(res, "Tenants listed successfully", result.data, 200, result.meta);
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        };
    };

    editTenant = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = req.body;

            const result = await this.superAdminService.editTenant(id, data);
            res.status(200).json({
                success: true,
                message: "Tenant edited successfully",
                data: result
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        };

    };

    deleteTenant = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = await this.superAdminService.deleteTenant(id);
            res.status(200).json({
                success: true,
                message: "Tenant deleted successfully",
                data: result
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    };

    detailTenant = async (req: Request, res: Response) => {
        const id = req.params.id
        if (!id) {
            res.status(400).json({
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
    }

    getDashboardStats = async (req: Request, res: Response) => {
        try {
            const result = await this.superAdminService.getDashboardStats();
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    };

    editTenantStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await this.superAdminService.editTenantStatus(id, status);
            res.status(200).json({
                success: true,
                message: "Status updated successfully",
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        };

    };
};
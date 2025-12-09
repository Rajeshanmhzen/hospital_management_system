import { Request, Response } from "express";
import { SuperAdminService } from '../services/superAdmin.service';

export class SuperAdminController {
    private superAdminService = new SuperAdminService();

    createSuperAdmin = async(req:Request, res:Response) => {
        try {
            const data = req.body;
            const result = await this.superAdminService.createSuperAdmin(data);

            res.status(201).json({
                success:true,
                message:"Super admin created successfully",
                data:result
            })
        } catch (err:any) {
            res.status(500).json({
                success:false,
                message:err.message
            });
        };
    };

    deleteSuperAdmin = async(req:Request, res:Response) => {
        try {
            const id = req.params.id;
            const result = await this.superAdminService.deleteSuperAdmin(id);
            res.status(200).json({
                success:true,
                message:"Super admin deleted successfully",
                data:result
            });
        } catch (err:any) {
           res.status(500).json({
            success:false,
            message:err.message
           }); 
        };
    };

    updateSuperAdmin = async(req:Request, res:Response) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const result = await this.superAdminService.updateSuperAdmin(id, data);

            res.status(200).json({
                success:true,
                message:"Super admin updated successfully",
                data:result
            });
        } catch (err:any) {
           res.status(500).json({
            success:false,
            message:err.message
           }); 
        };
    };

    createTenant = async(req:Request, res:Response) => {
        try {
            const tenantData = req.body;
           
            const result = await this.superAdminService.createTenant(tenantData);
            res.status(201).json({
                success:true,
                message:"Tenant created successfully",
                data:result
            });
        } catch (err:any) {
            res.status(500).json({
                success:false,
                message:err.message
            });
        };
    };

    getAllTenants = async(req:Request, res:Response) => {
        try {
            const result = await this.superAdminService.getAllTenants();
            res.status(200).json({
                success:true,
                message:"Tenants fetched successfully",
                data:result
            });
        } catch (err:any) {
            res.status(500).json({
                success:false,
                message:err.message
            });
        };
    };
    
    updateTenant = async(req:Request, res:Response) => {
        try {
        const id = req.params.id;
        const data = req.body;

        const result = await this.superAdminService.updateTenant(id, data);
        res.status(200).json({
            success:true,
            message:"Tenant updated successfully",
            data:result
        });
        } catch (err:any) {
            res.status(500).json({
                success:false,
                message:err.message
            });
        };
        
    };

    deleteTenant = async(req:Request, res:Response) => {
        try {
            const id = req.params.id;
            const result = await this.superAdminService.deleteTenant(id);
            res.status(200).json({
                success:true,
                message:"Tenant deleted successfully",
                data:result
            });
        } catch (err:any) {
           res.status(500).json({
            success:false,
            message:err.message
           }) 
        }
    };

    findTenantById = async(req:Request, res:Response)=> {
        const id = req.params.id
        if(!id) {
            res.status(400).json({
                success:false,
                message:"Id is required"
            });
        };
        const findTenant = await this.superAdminService.getTenantById(id);
        return res.status(200).json({
            success:true,
            message:"Tenant fetched successfully",
            data:findTenant
        });
    }
    
};
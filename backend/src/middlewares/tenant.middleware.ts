import {Request, Response, NextFunction} from "express";

export const tenantMiddleware = (req:Request, res:Response, next:NextFunction) =>{
    const tenantId = req.headers["x-tenant-id"];

    if(!tenantId){
        return res.status(400).json({error:"Tenant ID is required"});
    };

    (req as any).tenantId = tenantId;
    next();
};
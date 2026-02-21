import { NextFunction, Request, Response } from "express";

export function asyncHandler(fn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await fn(req, res, next);
            return result;
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
};

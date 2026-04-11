import { NextFunction, Request, Response } from "express";
import { isAppError } from "./appError.util";

export function asyncHandler(fn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await fn(req, res, next);
            return result;
        } catch (error: any) {
            if (res.headersSent) {
                return next(error);
            }

            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    code: error.code,
                    errors: error.details
                });
            }

            return res.status(500).json({
                success: false,
                message: error?.message || "Internal server error"
            });
        }
    };
};

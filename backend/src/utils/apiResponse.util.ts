import { Response } from "express";

interface SuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    meta?: any;
}

interface ErrorResponse {
    success: false;
    message: string;
    errors?: any;
}

export const sendSuccess = <T>(
    res: Response,
    message: string,
    data: T,
    statusCode: number = 200,
    meta?: any
) => {
    const response: SuccessResponse<T> = {
        success: true,
        message,
        data,
        meta,
    };
    return res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any
) => {
    const response: ErrorResponse = {
        success: false,
        message,
        errors,
    };
    return res.status(statusCode).json(response);
};

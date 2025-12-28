import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateAccessToken } from "../utils/jwt.util";

interface AuthRequest extends Request {
    user?: any;
}

export class AuthController {
    private authService = new AuthService;

    // Unified login for all user types
    login = async(req:Request, res:Response) => {
        try {
            const {email, password, userType, tenantId} = req.body;

        const data = {
            email,
            password,
            userType,
            tenantId
        };

        const result = await this.authService.login(data);

        res
        .cookie("access_token", result.token.accessToken,{ 
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .cookie("refresh_token",result.token.refreshToken,{ 
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200).json({
            success:true,
            message:"Login successful",
            data:{
                user:result.user,
                token:result.token
            }
        })
        } catch (err:any) {
            res.status(401).json({
                success:false, 
                message:err.message
            });
        }
        
    };

    // Specific method for super admin (backward compatibility)
    superAdminLogin = async (req: Request, res: Response) => {
        req.body.userType = 'SUPER_ADMIN';
        return this.login(req, res);
    };

    logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie("access_token")
            res.clearCookie("refresh_token")
            res.status(200).json({
                success: true,
                message: "Logout successful"
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    };

    refreshToken = async (req: AuthRequest, res: Response) => {
        try {
           const refreshToken = req.cookies.refresh_token;
           const id = req.user.id;
           if(!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
           }
           
            
        } catch (err: any) {
            res.status(401).json({
                success: false,
                message: err.message
            });
        }
    };
};
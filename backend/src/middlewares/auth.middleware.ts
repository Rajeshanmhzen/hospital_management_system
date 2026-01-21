import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/jwt.util';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (requiredRole?: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access token required'
        });
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token required'
        });
      }

      try {
        const decoded = verifyAccessToken(token) as any;

        if (requiredRole && decoded.role !== requiredRole) {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized'
          });
        }

        req.user = decoded;
        next();
      } catch (accessError: any) {
        // Access token expired, try to refresh automatically
        if (accessError.message.includes('jwt expired')) {
          const refreshToken = req.cookies?.refresh_token;

          if (!refreshToken) {
            return res.status(401).json({
              success: false,
              message: 'Please login!'
            });
          }

          try {
            const decoded = verifyRefreshToken(refreshToken) as any;

            if (requiredRole && decoded.role !== requiredRole) {
              return res.status(403).json({
                success: false,
                message: 'Unauthorized'
              });
            }

            const payload = decoded.tenantId
              ? { id: decoded.id, email: decoded.email, role: decoded.role, tenantId: decoded.tenantId }
              : { id: decoded.id, email: decoded.email, role: decoded.role };

            const newAccessToken = await generateAccessToken(payload);

            res.cookie("access_token", newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 15 * 60 * 1000
            });

            req.user = decoded;
            next();
          } catch (refreshError: any) {
            return res.status(401).json({
              success: false,
              message: 'Please login!'
            });
          }
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid token'
          });
        }
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  };
};
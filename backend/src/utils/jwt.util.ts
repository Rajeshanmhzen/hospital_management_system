import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = async (payload: any) => {
    return await jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = async (payload: any) => {
    return await jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

export const generateTokens = async (payload: any) => {
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_SECRET);
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_SECRET);
    } catch (error: any) {
        throw new Error(error.message);
    }
};
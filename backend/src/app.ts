import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index";
import {
    apiRateLimiter,
    requestIdMiddleware,
    requestTimingMiddleware,
    securityHeadersMiddleware,
} from "./middlewares/production.middleware";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(requestIdMiddleware);
app.use(requestTimingMiddleware);
app.use(securityHeadersMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
].filter(Boolean) as string[];

const allowDevLanOrigin = (origin: string) => {
    if (process.env.NODE_ENV === "production") return false;
    return /^https?:\/\/(192\.168|10\.|172\.(1[6-9]|2\d|3[0-1]))\.[\d.]+(:\d+)?$/.test(origin);
};

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow non-browser tools (no Origin header).
        if (!origin) return callback(null, true);

        if (configuredOrigins.includes(origin) || allowDevLanOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    exposeHeaders: ["Access-Control-Allow-Credentials"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use("/api", apiRateLimiter);

app.use("/api/v1", router);

export default app;

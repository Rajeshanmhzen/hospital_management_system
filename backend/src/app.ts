import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
    credentials:true,
    exposeHeaders: ['Access-Control-Allow-Credentials'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));


app.use("/api/v1", router);

export default app;
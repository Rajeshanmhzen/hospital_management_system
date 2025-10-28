import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import router from "./src/routes/index.js";
import { consoleLogger, morganMiddleware } from "./config/morgan.js";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())


if(process.env.NODE_ENV === "development") {
    app.use(consoleLogger)
}else {
    app.use(morganMiddleware)
}

// Routes
app.use("/api/v1", router)

// Error Handler
app.use(errorHandler);

export default app;

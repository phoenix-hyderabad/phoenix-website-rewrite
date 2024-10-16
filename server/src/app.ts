import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import corsOptions from "@/config/cors";
import type { ErrorRequestHandler } from "express";
import routes from "@/api";
import { AppError, HttpCode } from "./config/errors";
import { errorHandler } from "./lib/errorhandler";
import logger from "./lib/logger";

const app = express();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // requests per ip per window
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);
app.set("view engine", "jade");
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

app.use("/api/", routes);

// catch 404
app.use((_req, _res, next) => {
    next(
        new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: "Requested endpoint does not exist",
        })
    );
});

// error handler
const expressErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    errorHandler.handleError(err as Error | AppError, req, res);
};
app.use(expressErrorHandler);

process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception`);
    errorHandler.handleError(error);
});

export default app;

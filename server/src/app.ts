import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import corsOptions from "@/config/cors";
import type { ErrorRequestHandler } from "express";
import routes from "@/routes";

const app = express();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // requests per ip per window
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

app.use(limiter);
app.set("view engine", "jade");
app.use(cookieParser());
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

app.use(routes);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
    const err = new Error("Service not available");
    next(err);
});

// error handler
const errorHandler: ErrorRequestHandler = (_err, _req, res, _next) => {
    res.status(500).send(`Error`);
};
app.use(errorHandler);

export default app;

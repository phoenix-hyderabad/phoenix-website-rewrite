import express from "express";
import authRouter from "./auth";
import { AppError, HttpCode } from "@/config/errors";
import jwt from "jsonwebtoken";
import { SESSION_SECRET } from "@/config/environment";

const router = express.Router();

// Public routes

router.use(authRouter);

router.get("/hello", (_req, res) => {
    res.status(200).json({
        message: "Hello!",
    });
});

// Auth middleware

router.use((req, _res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return next(
            new AppError({
                description: "Unauthenticated",
                httpCode: HttpCode.UNAUTHORIZED,
            })
        );
    }
    jwt.verify(token, SESSION_SECRET, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string")
            return next(
                new AppError({
                    description: "Unauthorized",
                    httpCode: HttpCode.UNAUTHORIZED,
                })
            );
        req.user = {
            userId: decoded.userId as string,
            email: decoded.email as string | undefined,
        };
        next();
    });
});

// Protected routes

router.get("/authorized", (_req, res) => {
    res.status(200).json({
        message: "Authorized!",
    });
});

export default router;

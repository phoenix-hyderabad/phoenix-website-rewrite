import { GOOGLE_CLIENT_ID, SESSION_SECRET } from "@/config/environment";
import { AppError, HttpCode } from "@/config/errors";
import express from "express";
import asyncHandler from "express-async-handler";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import db from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const router = express.Router();

const bodySchema = z.object({
    token: z.string(),
});

router.post(
    "/login",
    asyncHandler(async (req, res, next) => {
        const parseResult = bodySchema.safeParse(req.body);
        if (!parseResult.success) {
            next(
                new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "token not found in body",
                    feedback: fromError(parseResult.error).toString(),
                })
            );
            return;
        }
        try {
            const ticket = await client.verifyIdToken({
                idToken: parseResult.data.token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) throw new Error("");
            const userId = payload.sub;
            const result = await db
                .select()
                .from(users)
                .where(
                    eq(
                        users.email,
                        payload.email ?? "https://youtu.be/xvFZjo5PgG0"
                    )
                );
            if (!result.length)
                return next(
                    new AppError({
                        httpCode: HttpCode.UNAUTHORIZED,
                        description: "This login isn't for you :)",
                    })
                );
            const accessToken = jwt.sign(
                {
                    userId: userId,
                    email: payload.email,
                },
                SESSION_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            res.status(200);
            res.json({ token: accessToken });
        } catch (e) {
            next(
                new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "Login error: invalid token",
                    feedback: JSON.stringify((e as Error).message),
                })
            );
        }
    })
);

// Auth verify middleware

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

export default router;

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
import { getAccess } from "@/lib/middleware/resources";
import { type User } from "@/types/auth";

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
            const ticketPayload = ticket.getPayload();
            if (!ticketPayload) throw new Error("");
            try {
                const result = await db
                    .select()
                    .from(users)
                    .where(
                        eq(
                            users.email,
                            ticketPayload.email ??
                                "https://youtu.be/xvFZjo5PgG0"
                        )
                    );
                if (!result.length)
                    return next(
                        new AppError({
                            httpCode: HttpCode.UNAUTHORIZED,
                            description: "This login isn't for you :)",
                        })
                    );
                const jwtPayload: User = {
                    userId: ticketPayload.sub,
                    email: result[0].email,
                    operations: getAccess(result[0].roles),
                };
                const accessToken = jwt.sign(jwtPayload, SESSION_SECRET, {
                    expiresIn: "10m",
                });
                res.status(200);
                res.json({ token: accessToken });
            } catch (e) {
                return next(
                    new AppError({
                        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                        description: "Login error: database error",
                        feedback: JSON.stringify(e as object),
                    })
                );
            }
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

// Auth middleware
// Attaches user object to req
router.use((req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return next();

    jwt.verify(parts[1], SESSION_SECRET, (err, decoded) => {
        if (err) return next();
        const jwtPayloadSchema = z.object({
            userId: z.string(),
            email: z.string(),
            operations: z.object({
                allowed: z.array(z.string()),
                disallowed: z.array(z.string()),
            }),
        });
        const parsed = jwtPayloadSchema.safeParse(decoded);
        if (parsed.success) req.user = parsed.data;
        next();
    });
});

export default router;

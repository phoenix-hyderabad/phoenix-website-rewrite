import { GOOGLE_CLIENT_ID, SESSION_SECRET } from "@/config/environment";
import { AppError, HttpCode } from "@/config/errors";
import express from "express";
import asyncHandler from "express-async-handler";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { fromError } from "zod-validation-error";

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
                    description: "invalid token",
                    feedback: JSON.stringify((e as Error).message),
                })
            );
        }
    })
);

export default router;

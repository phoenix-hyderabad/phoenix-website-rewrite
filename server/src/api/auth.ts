import { GOOGLE_CLIENT_ID, SESSION_SECRET } from "@/config/environment";
import { AppError, HttpCode } from "@/config/errors";
import express from "express";
import asyncHandler from "express-async-handler";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const router = express.Router();

router.post(
    "/login",
    asyncHandler(async (req, res, next) => {
        const { idToken } = req.body as { idToken: string | undefined };
        if (!idToken) {
            next(
                new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "token not found in body",
                })
            );
            return;
        }
        try {
            const ticket = await client.verifyIdToken({
                idToken,
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
        } catch {
            next(
                new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "invalid token",
                })
            );
        }
    })
);

export default router;

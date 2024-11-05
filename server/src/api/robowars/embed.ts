import { AppError, HttpCode } from "@/config/errors";
import db from "@/lib/db";
import { config } from "@/lib/db/schema/config";
import { checkAccess } from "@/lib/middleware/resources";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { fromError } from "zod-validation-error";
const router = express.Router();

router.get(
    "/",
    expressAsyncHandler(async (_req, res, next) => {
        try {
            const data = await db.query.config.findFirst({
                where(fields, { eq }) {
                    return eq(fields.key, "robowars_embed_url");
                },
            });
            res.status(HttpCode.OK).json(data?.value ?? null);
        } catch (e) {
            return next(
                new AppError({
                    httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                    description: "An error occurred",
                    feedback: `${(e as Error).stack}`,
                })
            );
        }
    })
);

const bodySchema = z.object({
    newUrl: z
        .string()
        .regex(
            /https:\/\/www.youtube.com\/embed\/.+/,
            "Invalid URL, should be a YouTube embed URL"
        ),
});

router.post(
    "/",
    checkAccess("robowars:embed"),
    expressAsyncHandler(async (req, res, next) => {
        const parsed = bodySchema.safeParse(req.body);
        if (!parsed.success) {
            return next(
                new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: fromError(parsed.error).toString(),
                })
            );
        }
        try {
            const updated = await db
                .insert(config)
                .values({
                    key: "robowars_embed_url",
                    value: parsed.data.newUrl,
                })
                .onConflictDoUpdate({
                    set: { value: parsed.data.newUrl },
                    target: [config.key],
                })
                .returning();

            if (!updated.length) {
                return next(
                    new AppError({
                        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                        description: "An error occurred",
                        feedback: "Failed to update the embed URL",
                    })
                );
            }
            res.status(HttpCode.OK).json(updated[0].value);
        } catch (e) {
            return next(
                new AppError({
                    httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                    description: "An error occurred",
                    feedback: `${(e as Error).stack}`,
                })
            );
        }
    })
);

export default router;

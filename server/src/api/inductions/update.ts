import { AppError, HttpCode } from "@/config/errors";
import db from "@/lib/db";
import { inductions } from "@/lib/db/schema/inductions";
import { checkAccess } from "@/lib/middleware/resources";
import { eq } from "drizzle-orm";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { fromError } from "zod-validation-error";
const router = express.Router();

const bodySchema = z.object({
    name: z.string(),
    url: z.string(),
    isOpen: z.boolean(),
});

router.patch(
    "/",
    checkAccess("inductions:edit"),
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
                .update(inductions)
                .set({
                    isOpen: parsed.data.isOpen,
                    url: parsed.data.url,
                })
                .where(eq(inductions.name, parsed.data.name))
                .returning();

            if (updated.length) res.status(HttpCode.OK).json(updated[0]);
            else
                next(
                    new AppError({
                        httpCode: HttpCode.BAD_REQUEST,
                        description: "Induction does not exist",
                    })
                );
        } catch (e) {
            return next(
                new AppError({
                    httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                    description: "Database error",
                    feedback: JSON.stringify(e as object),
                })
            );
        }
    })
);

export default router;

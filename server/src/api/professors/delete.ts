import express from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { checkAccess } from "@/lib/middleware/resources";
import { AppError, HttpCode } from "@/config/errors";
import db from "@/lib/db";
import { professors } from "@/lib/db/schema/professors";
import { eq } from "drizzle-orm";

const bodySchema = z.object({
    id: z.number(),
});

const router = express.Router();

router.delete(
    "/",
    checkAccess("professors:delete"),
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
            const deleted = await db
                .delete(professors)
                .where(eq(professors.id, parsed.data.id))
                .returning();

            if (deleted.length) res.status(HttpCode.OK).json(deleted[0]);
            else
                next(
                    new AppError({
                        httpCode: HttpCode.BAD_REQUEST,
                        description: "professor does not exist",
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

import { AppError, HttpCode } from "@/config/errors";
import db from "@/lib/db";
import { news } from "@/lib/db/schema/news";
import express from "express";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.get(
    "/",
    expressAsyncHandler(async (_req, res, next) => {
        try {
            const data = await db.select().from(news);

            res.status(HttpCode.OK).json(data);
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

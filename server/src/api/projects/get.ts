import { AppError, HttpCode } from "@/config/errors";
import db from "@/lib/db";
import express from "express";
import expressAsyncHandler from "express-async-handler";
const router = express.Router();

router.get(
    "/",
    expressAsyncHandler(async (_req, res, next) => {
        try {
            const data = await db.query.projects.findMany({
                where(fields, { isNotNull }) {
                    return isNotNull(fields.current);
                },
            });
            res.status(HttpCode.OK).json(data);
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

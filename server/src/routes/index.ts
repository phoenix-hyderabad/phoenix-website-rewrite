import express from "express";

const router = express.Router();

router.get("/api/hello", (_req, res) => {
    res.status(200).json({
        data: "Hello!",
    });
});

export default router;

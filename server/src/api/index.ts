import express from "express";
import authRouter from "./auth";
import inductionsRouter from "./inductions";

const router = express.Router();

// Public routes

router.get("/hello", (_req, res) => {
    res.status(200).json({
        message: "Hello!",
    });
});

// Auth routes and middleware

router.use(authRouter);

// api routes

router.use("/inductions", inductionsRouter);

export default router;

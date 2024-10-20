import express from "express";
import authRouter from "./auth";
import inductionsRouter from "./inductions";
import professorsRouter from "./professors";

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

//inductions
router.use("/inductions", inductionsRouter);

//professors
router.use("/professors", professorsRouter);

export default router;

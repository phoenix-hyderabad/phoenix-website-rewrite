import express from "express";
import authRouter from "./auth";
import inductionsRouter from "./inductions";
import professorsRouter from "./professors";
import projectsRouter from "./projects";

const router = express.Router();

// Auth routes and middleware
router.use(authRouter);

// api routes
router.use("/inductions", inductionsRouter);
router.use("/professors", professorsRouter);
router.use("/projects", projectsRouter);

export default router;

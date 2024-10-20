import express from "express";
const router = express.Router();
import deleteProfessor from "./delete";
import get from "./get";
import add from "./add";
router.use("/get", get);
router.use("/add", add);
router.use("/delete", deleteProfessor);

export default router;

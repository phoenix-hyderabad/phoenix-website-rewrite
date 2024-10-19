import express from "express";
const router = express.Router();
import get from "./get";
import add from "./add";

router.use("/get", get);
router.use("/add", add);

export default router;

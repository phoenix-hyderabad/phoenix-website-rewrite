import express from "express";
const router = express.Router();
import get from "./get";
import update from "./update";

router.use("/get", get);
router.use("/update", update);

export default router;

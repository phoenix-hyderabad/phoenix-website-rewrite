import express from "express";
import embed from "./embed";

const router = express.Router();

router.use("/embed", embed);

export default router;

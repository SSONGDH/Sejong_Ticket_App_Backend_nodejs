import express from "express";
import { rootConnection } from "../../../controllers/root/rootConnectionController.js";

const router = express.Router();

router.get("/connection", rootConnection);

// ✅ default export 추가
export default router;

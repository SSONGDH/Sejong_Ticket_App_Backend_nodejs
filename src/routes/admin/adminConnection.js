import express from "express";
import { adminConnection } from "../../controllers/admin/adminConnectionController.js";

const router = express.Router();

router.get("/connection", adminConnection);

export default router;

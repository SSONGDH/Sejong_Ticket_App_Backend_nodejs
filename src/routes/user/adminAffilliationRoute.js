import express from "express";
import { getMyAdminAffilliaions } from "../../controllers/user/adminAffiliationController.js";

const router = express.Router();

router.get("/adminAffilliation/list", getMyAdminAffilliaions);

export default router;

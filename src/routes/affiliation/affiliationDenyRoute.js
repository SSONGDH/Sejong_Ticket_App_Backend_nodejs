import express from "express";
import {
  denyCreateAffiliationRequest,
  denyAdminAffiliationRequest,
} from "../../controllers/affiliation/affiliationDenyController.js";

const router = express.Router();

router.post("/deny/create", denyCreateAffiliationRequest);
router.post("/deny/admin", denyAdminAffiliationRequest);

export default router;

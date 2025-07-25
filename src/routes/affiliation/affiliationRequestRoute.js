import express from "express";
import { postAffiliationRequest } from "../../controllers/affiliation/affiliationRequestController.js";

const router = express.Router();

router.post("/request", postAffiliationRequest);

export default router;

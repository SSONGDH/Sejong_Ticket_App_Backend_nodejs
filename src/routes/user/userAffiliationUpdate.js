import express from "express";
import { updateAffiliation } from "../../controllers/user/mypageController.js";

const router = express.Router();

router.put("/affiliationUpdate", updateAffiliation);

export default router;

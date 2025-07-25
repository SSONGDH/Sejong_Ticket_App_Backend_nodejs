import express from "express";
import { getMyPage } from "../../controllers/user/mypageController.js";

const router = express.Router();

router.get("/mypage", getMyPage);

export default router;

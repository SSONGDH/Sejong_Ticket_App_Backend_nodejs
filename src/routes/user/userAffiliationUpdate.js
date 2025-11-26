import express from "express";
import { updateAffiliation } from "../../controllers/user/mypageController.js";
// [1] 미들웨어 불러오기
import { authenticate } from "../../middlewares/authMiddleware.js"; 

const router = express.Router();

// [2] 미들웨어(authenticate) 장착!
// 이제 문지기가 먼저 유저 정보를 확인하고 req.user를 만들어줍니다.
router.put("/affiliationUpdate", authenticate, updateAffiliation);

export default router;
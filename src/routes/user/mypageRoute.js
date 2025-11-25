import express from "express";
import {
  getMyPage,
  updateAffiliation,
} from "../../controllers/user/mypageController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 마이페이지 조회 (로그인 필수)
router.get("/mypage", authenticate, getMyPage);

// (참고) updateAffiliation 컨트롤러도 같은 파일에 있었는데,
// 만약 이 라우터 파일에서 같이 쓴다면 아래처럼 추가하시면 됩니다.
// router.patch("/affiliation", authenticate, updateAffiliation);
// (혹은 userAffiliationUpdate.js 라는 다른 라우터 파일이 있다면 거기서도 authenticate만 붙이면 됩니다!)

export default router;

import express from "express";
import User from "../../models/userModel.js"; // User 모델 불러오기
import verifySSOService from "../../service/ssoAuth.js"; // SSO 인증 서비스 가져오기

const router = express.Router();

// 관리자 인증 API (GET 방식)
router.get("/admin/connection", async (req, res) => {
  const { authorization } = req.headers; // 헤더에서 Authorization 값을 가져옵니다.

  if (!authorization) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "SSO 토큰이 제공되지 않았습니다.",
    });
  }

  try {
    // 1️⃣ SSO 토큰을 사용하여 사용자 프로필 정보 확인
    const ssoToken = authorization.split(" ")[1]; // Bearer 토큰에서 실제 토큰을 추출
    const profileData = await verifySSOService.verifySSOToken(ssoToken);

    // 2️⃣ 프로필 데이터에서 학번(studentId)으로 유저 조회
    const user = await User.findOne({ studentId: profileData.studentId });

    // 3️⃣ 유저가 존재하지 않으면
    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    // 4️⃣ 유저의 admin 값이 False라면
    if (user.admin === false) {
      return res.status(403).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "권한이 없습니다.",
      });
    }

    // 5️⃣ 유저의 admin 값이 True라면 관리자 모드 접속 가능
    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "관리자 모드 접속이 확인되었습니다.",
    });
  } catch (error) {
    console.error("❌ 관리자 인증 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0004",
      message: "서버 오류",
    });
  }
});

export default router;

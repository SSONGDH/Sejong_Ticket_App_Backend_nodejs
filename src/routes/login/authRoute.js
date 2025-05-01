import express from "express";
import AuthService from "../../service/authService.js";
import User from "../../models/userModel.js"; // User 모델 불러오기

const router = express.Router();

router.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  let userProfile; // userProfile 변수를 먼저 선언
  let ssotoken;

  try {
    // 1️⃣ 학교 SSO 로그인 수행 → 사용자 정보 가져오기
    userProfile = await AuthService.login(userId, password);
    ssotoken = await AuthService.getSsotoken(userId, password);
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ error: "Failed to authenticate or fetch profile" });
  }

  if (!userProfile || !userProfile.body || !userProfile.body.studentId) {
    console.log("⚠️ userProfile이 유효하지 않음:", userProfile);
    return res.status(400).json({ error: "Invalid user profile" });
  }

  // ✅ userProfile.body에서 데이터 추출
  const { name, studentId, major, gradeLevel } = userProfile.body;

  try {
    // 2️⃣ MongoDB에서 studentId로 기존 유저 찾기
    let user = await User.findOne({ studentId });

    if (!user) {
      console.log("🆕 새로운 유저 생성");

      // 3️⃣ 유저가 없으면 새로 생성
      user = new User({
        name,
        studentId,
        major, // department -> major로 수정
        gradeLevel, // gradeLevel m[추가
        tickets: [], // 기본 값으로 빈 배열
      });
    } else {
      // console.log("🔄 기존 유저 업데이트");
      user.name = name;
      user.major = major; // department -> major로 수정
      user.gradeLevel = gradeLevel; // gradeLevel 추가
    }

    await user.save();
  } catch (error) {
    console.error("❌ DB 저장 중 오류 발생:", error);
    return res
      .status(500)
      .json({ error: "Failed to save user data in the database" });
  }
  //  console.log("✅response.cookie에 포함된 token:", ssotoken);
  // ✅ SSO 토큰을 HTTP-Only 쿠키로 저장
  res.cookie("ssotoken", ssotoken, {
    httpOnly: true, // JavaScript에서 접근 불가
    secure: false, // HTTPS에서만 사용 가능 (개발 중에는 false로 변경 가능)
    sameSite: "Strict", // CSRF 방지
  });

  return res.status(200).json({
    isSuccess: true,
    message: "로그인 및 사용자 정보 저장 완료",
    result: userProfile.body, // userProfile.body 반환
  });
});

export default router;

// src/services/auth/authService.js

// 1. 라이브러리 래퍼 (토큰 발급용)
import SchoolAuthService from "../AuthService.js";
// 2. ★ 작성자님이 만든, 잘 돌아가던 그 코드 (프로필 파싱용)
import VerifySSOService from "../ssoAuth.js";
import User from "../../models/userModel.js";

export const handleLogin = async ({ userId, password }) => {
  try {
    console.log(`🔄 로그인 시도: ${userId}`);

    // ---------------------------------------------------------
    // [STEP 1] 토큰 발급은 라이브러리에게 맡김 (이건 될 확률 높음)
    // ---------------------------------------------------------
    // SchoolAuthService.getSsotoken은 라이브러리의 getAuthenticatedSsotoken을 호출함
    const ssotoken = await SchoolAuthService.getSsotoken(userId, password);

    console.log("✅ SSO 토큰 발급 성공"); // 토큰 로그는 보안상 출력 X

    // ---------------------------------------------------------
    // [STEP 2] ★ 핵심 변경 ★
    // 라이브러리 대신, "원래 잘 되던 내 코드"로 프로필을 가져옵니다.
    // ---------------------------------------------------------
    const profile = await VerifySSOService.verifySSOToken(ssotoken);

    console.log(`✅ 프로필 조회 성공: ${profile.name} (${profile.studentId})`);

    // ---------------------------------------------------------
    // [STEP 3] DB 저장 (Upsert) - 기존 로직 유지
    // ---------------------------------------------------------
    const user = await User.findOneAndUpdate(
      { studentId: profile.studentId },
      {
        $set: {
          name: profile.name,
          major: profile.major,
          gradeLevel: profile.gradeLevel,
        },
        $setOnInsert: {
          tickets: [],
          refunds: [],
          root: false,
          notification: true, // 초기값
        },
      },
      { new: true, upsert: true }
    );

    return user;
  } catch (error) {
    console.error("❌ handleLogin 처리 중 오류:", error.message);
    throw error;
  }
};

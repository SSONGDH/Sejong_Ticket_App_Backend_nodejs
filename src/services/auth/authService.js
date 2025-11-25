// 📁 src/services/auth/authService.js

// 1. 학교 접속기 (라이브러리 래퍼) - 상위 폴더(../)에 있음
import SchoolAuthService from "../authService.js";

// 2. 프로필 파서 (Cheerio) - 상위 폴더(../)에 있음
import VerifySSOService from "../ssoAuth.js";

// 3. 유저 모델
import User from "../../models/userModel.js";

export const handleLogin = async ({ userId, password }) => {
  try {
    console.log(`🔄 로그인 시도: ${userId}`);

    // ---------------------------------------------------------
    // [STEP 1] 학교 SSO 토큰 발급 (라이브러리 사용)
    // ---------------------------------------------------------
    // 학교 서버에서 토큰만 받아옵니다. (이건 잘 됨)
    const ssotoken = await SchoolAuthService.getSsotoken(userId, password);

    // ---------------------------------------------------------
    // [STEP 2] 프로필 정보 가져오기 (내 코드 사용 - Cheerio)
    // ---------------------------------------------------------
    // 받아온 토큰을 내 파서에게 넘겨서 학생 정보를 긁어옵니다.
    // (라이브러리 프로필 파싱 기능은 AWS에서 막히므로 안 씀)
    const profile = await VerifySSOService.verifySSOToken(ssotoken);

    console.log(`✅ 인증 성공: ${profile.name} (${profile.studentId})`);

    // ---------------------------------------------------------
    // [STEP 3] DB에 저장 또는 업데이트 (Upsert)
    // ---------------------------------------------------------
    const user = await User.findOneAndUpdate(
      { studentId: profile.studentId }, // 검색 조건
      {
        $set: {
          name: profile.name,
          major: profile.major,
          gradeLevel: profile.gradeLevel,
          // 기타 업데이트할 필드가 있다면 여기에 추가
        },
        $setOnInsert: {
          // 문서가 새로 생성될 때만 들어갈 초기값
          tickets: [],
          refunds: [],
          root: false,
          notification: true,
        },
      },
      { new: true, upsert: true } // 옵션: 업데이트 후 최신 문서 반환, 없으면 생성
    );

    // [STEP 4] 최종적으로 DB 유저 객체를 반환 (컨트롤러가 JWT 만들 때 씀)
    return user;
  } catch (error) {
    console.error("❌ 로그인 프로세스 실패:", error.message);
    // 컨트롤러에게 에러를 던짐
    throw error;
  }
};

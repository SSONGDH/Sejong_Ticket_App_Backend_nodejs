import verifySSOService from "../../services/ssoAuth.js";
import { getMyPageInfoByStudentId } from "../../services/user/mypageService.js";

export const getMyPage = async (req, res) => {
  const ssotoken = req.cookies.ssotoken;

  if (!ssotoken) {
    return res.status(400).json({
      code: "ERROR-0001",
      message: "SSO 토큰이 없습니다.",
      result: null,
    });
  }

  try {
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

    if (!userProfile || !userProfile.studentId) {
      return res.status(401).json({
        code: "ERROR-0002",
        message: "SSO 인증 실패",
        result: null,
      });
    }

    const userInfo = await getMyPageInfoByStudentId(userProfile.studentId);

    return res.status(200).json({
      code: "SUCCESS-0000",
      message: "마이페이지 정보 조회 성공",
      result: userInfo,
    });
  } catch (error) {
    console.error("❌ 마이페이지 조회 중 오류:", error);
    return res.status(error.status || 500).json({
      code: "ERROR-9999",
      message: error.message || "서버 오류",
      result: null,
    });
  }
};

import User from "../../models/userModel.js";
import verifySSOService from "../../services/ssoAuth.js";

export const rootConnection = async (req, res) => {
  const ssoToken = req.cookies.ssotoken;

  if (!ssoToken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "SSO 토큰이 제공되지 않았습니다.",
    });
  }

  try {
    const profileData = await verifySSOService.verifySSOToken(ssoToken);
    const user = await User.findOne({ studentId: profileData.studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    if (user.root === false) {
      return res.status(403).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "권한이 없습니다.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "개발자 모드 접속이 확인되었습니다.",
    });
  } catch (error) {
    console.error(`❌ 관리자 인증 오류 - token: ${ssoToken}`, error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0004",
      message: "서버 오류",
    });
  }
};

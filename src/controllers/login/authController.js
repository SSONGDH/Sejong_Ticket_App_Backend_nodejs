// 📁 src/controllers/login/authController.js
import { handleLogin } from "../../services/auth/authService.js";

export const loginController = async (req, res) => {
  try {
    const { response, ssotoken } = await handleLogin(req.body);

    res.cookie("ssotoken", ssotoken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(200).json({
      isSuccess: true,
      message: "로그인 및 사용자 정보 저장 완료",
      result: response,
    });
  } catch (error) {
    console.error("❌ loginController 에러:", error);
    return res.status(error.status || 500).json({
      isSuccess: false,
      error: error.message || "서버 오류 발생",
    });
  }
};

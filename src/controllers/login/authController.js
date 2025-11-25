// src/controllers/login/authController.js
import { handleLogin } from "../../services/auth/authService.js";
import { generateToken } from "../../utils/jwt.js";

export const loginController = async (req, res) => {
  try {
    const user = await handleLogin(req.body);
    const accessToken = generateToken(user);

    // ★ [핵심] 헤더(JSON) 대신 쿠키에 JWT를 담습니다.
    // 안드로이드 앱이 자동으로 이 쿠키를 저장하고 다음 요청 때 가져옵니다.
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // 보안 강화 (자바스크립트 접근 불가)
      secure: false, // https가 아니면 false (개발환경), 배포시 true 권장
      maxAge: 24 * 60 * 60 * 1000, // 1일 (토큰 만료시간과 맞춤)
    });

    return res.status(200).json({
      isSuccess: true,
      message: "로그인 성공 (쿠키 발급)",
      // result에 토큰 안 줘도 됨 (쿠키에 있으니까)
      result: {
        name: user.name,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    // 에러 처리...
  }
};

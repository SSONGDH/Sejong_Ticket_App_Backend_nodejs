// 📁 src/services/auth/authService.js
import AuthService from "../authService.js"; // ✅ 기존 SSO 인증 로직 사용
import User from "../../models/userModel.js";

export const handleLogin = async ({ userId, password }) => {
  let userProfile, ssotoken;

  try {
    userProfile = await AuthService.login(userId, password);
    ssotoken = await AuthService.getSsotoken(userId, password);
  } catch (error) {
    throw { status: 500, message: "SSO 로그인 또는 프로필 조회 실패" };
  }

  if (!userProfile?.body?.studentId) {
    throw { status: 400, message: "유효하지 않은 사용자 프로필" };
  }

  const { name, studentId, major, gradeLevel } = userProfile.body;

  try {
    let user = await User.findOne({ studentId });

    if (!user) {
      user = new User({ name, studentId, major, gradeLevel, tickets: [] });
    } else {
      user.name = name;
      user.major = major;
      user.gradeLevel = gradeLevel;
    }

    await user.save();
  } catch (error) {
    throw { status: 500, message: "DB 저장 실패" };
  }

  return { response: userProfile.body, ssotoken };
};

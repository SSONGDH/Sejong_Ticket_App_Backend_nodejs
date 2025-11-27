import SchoolAuthService from "../authService.js";
import verifySSOService from "../ssoAuth.js";
import User from "../../models/userModel.js";

const schoolAuthService = new SchoolAuthService();

export const handleLogin = async ({ userId, password }) => {
  try {
    const ssoToken = await schoolAuthService.getSsotoken(userId, password);

    const profile = await verifySSOService.verifySSOToken(ssoToken);

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
          notification: true,
        },
      },
      { new: true, upsert: true }
    );

    return user;
  } catch (error) {
    console.error("❌ 로그인 프로세스 실패:", error.message);
    throw error;
  }
};

import User from "../../models/userModel.js";
import VerifySSOService from "../ssoAuth.js";

export const getAdminAffiliationsBySSO = async (ssoToken) => {
  // 1. SSO 토큰으로 학생 정보 조회
  const profile = await VerifySSOService.verifySSOToken(ssoToken);
  if (!profile || !profile.studentId) {
    throw new Error("SSO 인증 실패: 학번을 가져올 수 없음");
  }

  // 2. DB에서 해당 유저 조회
  const user = await User.findOne({ studentId: profile.studentId });
  if (!user) {
    throw new Error("해당 유저를 찾을 수 없습니다.");
  }

  // 3. affiliations 중 admin === true만 필터링
  const adminAffiliations = (user.affiliations || []).filter(
    (aff) => aff.admin === true
  );

  return adminAffiliations;
};

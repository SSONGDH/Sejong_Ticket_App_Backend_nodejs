import User from "../../models/userModel.js";
// import VerifySSOService ... (삭제)

// [변경] 함수 이름도 명확하게 바꾸는 걸 추천 (BySSO -> ByStudentId)
// 파라미터: ssoToken -> studentId
export const getAdminAffiliationsByStudentId = async (studentId) => {
  // [삭제된 로직] verifySSOService 호출 부분

  // 1. DB에서 해당 유저 조회 (studentId 사용)
  const user = await User.findOne({ studentId });

  if (!user) {
    throw new Error("해당 유저를 찾을 수 없습니다.");
  }

  // 2. affiliations 중 admin === true만 필터링
  const adminAffiliations = (user.affiliations || []).filter(
    (aff) => aff.admin === true
  );

  return adminAffiliations;
};

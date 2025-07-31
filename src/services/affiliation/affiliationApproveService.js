import AffiliationRequest from "../../models/affiliationRequestModel.js";
import User from "../../models/userModel.js";

export const handleAffiliationApproval = async (requestId) => {
  const request = await AffiliationRequest.findById(requestId);
  if (!request) throw new Error("해당 요청을 찾을 수 없습니다.");
  if (request.status !== "pending") throw new Error("이미 처리된 요청입니다.");

  // 요청 상태 승인으로 변경
  request.status = "approved";
  await request.save();

  // 유저 찾기
  const user = await User.findOne({ studentId: request.studentId });
  if (!user) throw new Error("해당 유저를 찾을 수 없습니다.");

  const affiliationName = request.affiliationName;

  // 소속 추가 (중복 없이)
  if (!user.affiliation) user.affiliation = [];
  if (!user.affiliation.includes(affiliationName)) {
    user.affiliation.push(affiliationName);
  }

  // 관리자인 경우 admin 필드에 추가 (구조: { 소속: true } 형태)
  if (request.requestAdmin) {
    if (!user.admin || typeof user.admin !== "object") {
      user.admin = {};
    }
    user.admin[affiliationName] = true;
  }

  await user.save();

  return {
    message: "승인이 완료되었습니다.",
    userId: user._id,
    updatedAffiliation: user.affiliation,
    isAdmin: user.admin?.[affiliationName] || false,
  };
};

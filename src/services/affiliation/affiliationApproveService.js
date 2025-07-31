import AffiliationRequest from "../../models/affiliationRequestModel.js";
import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js";

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

  // createAffiliation: true인 경우에만 새 소속 생성 및 유저 affiliation 추가
  if (request.createAffiliation) {
    const existing = await Affiliation.findOne({ name: affiliationName });
    if (!existing) {
      // 새 소속 생성 시 멤버 수는 1명 (승인된 유저)
      await Affiliation.create({
        name: affiliationName,
        membersCount: 1,
        admins: request.requestAdmin ? [user._id] : [],
      });
    }
    // 유저 affiliation 배열에 소속 추가 (중복 없이)
    if (!user.affiliation) user.affiliation = [];
    if (!user.affiliation.includes(affiliationName)) {
      user.affiliation.push(affiliationName);
    }
  }

  // requestAdmin: true면 유저 admin 권한 true로 변경
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

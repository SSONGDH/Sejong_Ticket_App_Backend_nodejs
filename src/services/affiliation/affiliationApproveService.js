import AffiliationRequest from "../../models/affiliationRequestModel.js";
import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js"; // 새로 추가

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

  // 소속 DB에 저장 / 업데이트
  if (request.createAffiliation) {
    // 새 소속 생성
    const existing = await Affiliation.findOne({ name: affiliationName });
    if (!existing) {
      // 새 소속 생성 시 멤버 수는 1명 (승인된 유저)
      await Affiliation.create({
        name: affiliationName,
        membersCount: 1,
        admins: request.requestAdmin ? [user._id] : [],
      });
    } else {
      // 이미 존재하면 멤버 수 +1, 관리자 권한이 있으면 admins에 추가
      if (!existing.admins.includes(user._id) && request.requestAdmin) {
        existing.admins.push(user._id);
      }
      existing.membersCount += 1;
      await existing.save();
    }
  } else {
    // 기존 소속이라면 멤버 수 +1, 관리자 권한 있으면 admins에 추가
    const existing = await Affiliation.findOne({ name: affiliationName });
    if (existing) {
      if (!existing.admins.includes(user._id) && request.requestAdmin) {
        existing.admins.push(user._id);
      }
      existing.membersCount += 1;
      await existing.save();
    } else {
      // 기존 소속인데 DB에 없으면 새로 생성 (멤버 1명)
      await Affiliation.create({
        name: affiliationName,
        membersCount: 1,
        admins: request.requestAdmin ? [user._id] : [],
      });
    }
  }

  await user.save();

  return {
    message: "승인이 완료되었습니다.",
    userId: user._id,
    updatedAffiliation: user.affiliation,
    isAdmin: user.admin?.[affiliationName] || false,
  };
};

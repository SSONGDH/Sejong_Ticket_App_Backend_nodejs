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
  let affiliationDoc;

  // createAffiliation: true면 새 소속 생성
  if (request.createAffiliation) {
    affiliationDoc = await Affiliation.findOne({ name: affiliationName });
    if (!affiliationDoc) {
      // 새 소속 생성 (멤버 1명)
      affiliationDoc = await Affiliation.create({
        name: affiliationName,
        membersCount: 1,
        members: [user._id],
      });
    } else {
      // 기존 소속이면 멤버 추가
      if (!affiliationDoc.members.includes(user._id)) {
        affiliationDoc.members.push(user._id);
        affiliationDoc.membersCount = affiliationDoc.members.length;
        await affiliationDoc.save();
      }
    }
  } else {
    // 기존 소속 불러오기
    affiliationDoc = await Affiliation.findOne({ name: affiliationName });
    if (!affiliationDoc) throw new Error("소속을 찾을 수 없습니다.");

    // 멤버 추가
    if (!affiliationDoc.members.includes(user._id)) {
      affiliationDoc.members.push(user._id);
      affiliationDoc.membersCount = affiliationDoc.members.length;
      await affiliationDoc.save();
    }
  }

  // 유저 affiliations 배열에 소속 추가 (중복 방지)
  if (!Array.isArray(user.affiliations)) {
    user.affiliations = [];
  }
  const existingAff = user.affiliations.find((a) => a.name === affiliationName);
  if (!existingAff) {
    user.affiliations.push({
      id: affiliationDoc._id,
      name: affiliationName,
      admin: !!request.requestAdmin,
    });
  } else if (request.requestAdmin) {
    // 기존 소속이 있으면 admin 권한 업데이트
    existingAff.admin = true;
  }

  await user.save();

  return {
    message: "승인이 완료되었습니다.",
    userId: user._id,
    updatedAffiliations: user.affiliations,
    isAdmin:
      user.affiliations.find((a) => a.name === affiliationName)?.admin || false,
  };
};

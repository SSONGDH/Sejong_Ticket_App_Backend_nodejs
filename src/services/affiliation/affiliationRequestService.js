import AffiliationRequest from "../../models/affiliationRequestModel.js";
import User from "../../models/userModel.js";

export const submitAffiliationRequest = async (requestData) => {
  const { studentId, affiliationName, createAffiliation, requestAdmin } =
    requestData;

  // 1. 이미 해당 소속 멤버인지 확인
  const user = await User.findOne({ studentId });
  if (user && Array.isArray(user.affiliations)) {
    const isAlreadyMember = user.affiliations.some(
      (aff) => aff.name === affiliationName
    );
    if (isAlreadyMember) {
      const error = new Error("이미 해당 소속의 멤버입니다.");
      error.code = "ALREADY_MEMBER";
      throw error;
    }
  }

  // 2. 중복 요청 여부 확인 (소속명, 생성여부, 권한여부까지 포함, 상태는 pending)
  const existingRequest = await AffiliationRequest.findOne({
    studentId,
    affiliationName,
    createAffiliation,
    requestAdmin,
    status: "pending",
  });

  if (existingRequest) {
    const error = new Error("이미 동일한 조건으로 신청한 요청이 존재합니다.");
    error.code = "DUPLICATE_REQUEST";
    throw error;
  }

  // 3. 새 요청 저장 (status 명시적으로 pending)
  const newRequest = new AffiliationRequest({
    ...requestData,
    status: "pending",
  });

  return await newRequest.save();
};

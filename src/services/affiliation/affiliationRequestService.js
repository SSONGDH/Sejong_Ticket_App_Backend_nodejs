import AffiliationRequest from "../../models/affiliationRequestModel.js";

export const submitAffiliationRequest = async (requestData) => {
  const { studentId, affiliationName } = requestData;

  // 중복 요청 여부 확인
  const existingRequest = await AffiliationRequest.findOne({
    studentId,
    affiliationName,
    status: "pending",
  });

  if (existingRequest) {
    const error = new Error("이미 해당 소속으로 신청한 요청이 존재합니다.");
    error.code = "DUPLICATE_REQUEST";
    throw error;
  }

  // 새 요청 저장 (명시적으로 status: "pending")
  const newRequest = new AffiliationRequest({
    ...requestData,
    status: "pending",
  });

  return await newRequest.save();
};

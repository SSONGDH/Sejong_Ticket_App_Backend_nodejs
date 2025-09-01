import AffiliationRequest from "../../models/affiliationRequestModel.js";
import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js";

export const submitAffiliationRequest = async (requestData) => {
  const { studentId, affiliationName, createAffiliation, requestAdmin } =
    requestData;

  // 1. 유저 조회
  const user = await User.findOne({ studentId });

  if (user && Array.isArray(user.affiliations)) {
    // 1-1. 이미 소속의 관리자면 신청 막기
    const isAlreadyAdmin = user.affiliations.some(
      (aff) => aff.name === affiliationName && aff.admin === true
    );

    if (isAlreadyAdmin) {
      const error = new Error("이미 해당 소속이 존재합니다.");
      error.code = "ALREADY_MEMBER";
      throw error;
    }
  }

  // 2. 동일 유저의 중복 요청 여부 확인
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

  // 3. 소속 존재 여부 확인
  const nameExistsInRequests = await AffiliationRequest.findOne({
    affiliationName,
  });

  const nameExistsInAffiliations = await Affiliation.findOne({
    name: affiliationName,
  });

  // ✅ 케이스별 처리
  if (createAffiliation) {
    // 새 소속 만들기 → DB에 없어야 함
    if (nameExistsInRequests || nameExistsInAffiliations) {
      const error = new Error("이미 해당 소속명이 사용 중입니다.");
      error.code = "AFFILIATION_NAME_EXISTS";
      throw error;
    }
  }

  if (requestAdmin) {
    // 관리자 권한 신청 → DB에 반드시 존재해야 함
    if (!nameExistsInAffiliations) {
      const error = new Error(
        "해당 소속이 존재하지 않습니다. 관리자 권한 신청 불가"
      );
      error.code = "AFFILIATION_NOT_FOUND";
      throw error;
    }
  }

  // 4. 새 요청 저장 (status 명시적으로 pending)
  const newRequest = new AffiliationRequest({
    ...requestData,
    status: "pending",
  });

  return await newRequest.save();
};

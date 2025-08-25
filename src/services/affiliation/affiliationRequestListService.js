import AffiliationRequest from "../../models/affiliationRequestModel.js";

/**
 * 소속 신청 전체 조회 (필터링 가능)
 */
export const getAffiliationRequests = async (status) => {
  try {
    const filter = status ? { status } : {};
    const requests = await AffiliationRequest.find(filter).sort({
      createdAt: -1,
    });

    return {
      status: 200,
      code: "SUCCESS-0000",
      message: "소속 신청 목록 조회 성공",
      result: requests,
    };
  } catch (error) {
    console.error("❌ getAffiliationRequests Error:", error);
    return {
      status: 500,
      code: "ERROR-0001",
      message: "서버 오류로 소속 신청 목록을 가져올 수 없습니다.",
    };
  }
};

/**
 * 특정 신청 상세 조회
 */
export const getAffiliationRequestById = async (id) => {
  try {
    const request = await AffiliationRequest.findById(id);

    if (!request) {
      return {
        status: 404,
        code: "ERROR-0002",
        message: "해당 ID의 신청을 찾을 수 없습니다.",
      };
    }

    return {
      status: 200,
      code: "SUCCESS-0000",
      message: "소속 신청 상세 조회 성공",
      result: request,
    };
  } catch (error) {
    console.error("❌ getAffiliationRequestById Error:", error);
    return {
      status: 500,
      code: "ERROR-0003",
      message: "서버 오류로 신청 상세를 가져올 수 없습니다.",
    };
  }
};

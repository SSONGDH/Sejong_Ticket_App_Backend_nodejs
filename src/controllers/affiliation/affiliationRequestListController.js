import {
  getAffiliationRequests,
  getAffiliationRequestById,
} from "../../services/affiliation/affiliationRequestListService.js";

/**
 * 전체 소속 신청 조회
 * - GET /affiliation/affiliationRequestsList?status=pending
 */
export const affiliationRequestListController = async (req, res) => {
  try {
    const { status } = req.query;
    const response = await getAffiliationRequests(status);

    return res.status(response.status).json(response);
  } catch (error) {
    console.error("❌ affiliationRequestListController Error:", error);
    return res.status(500).json({
      status: 500,
      message: "서버 에러가 발생했습니다.",
      error: error.message,
    });
  }
};

/**
 * 특정 신청 상세 조회
 * - GET /affiliation/affiliationRequests/:id
 */
export const affiliationRequestDetailController = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getAffiliationRequestById(id);

    return res.status(response.status).json(response);
  } catch (error) {
    console.error("❌ affiliationRequestDetailController Error:", error);
    return res.status(500).json({
      status: 500,
      message: "서버 에러가 발생했습니다.",
      error: error.message,
    });
  }
};

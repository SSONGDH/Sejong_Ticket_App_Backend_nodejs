import {
  getAffiliationRequests,
  getAffiliationRequestById,
} from "../../services/affiliation/affiliationRequestListService.js";

/**
 * 전체 소속 신청 조회
 * - GET /affiliationRequests?status=pending
 */
export const affiliationRequestListController = async (req, res) => {
  const { status } = req.query;

  const response = await getAffiliationRequests(status);
  res.status(response.status).json(response);
};

/**
 * 특정 신청 상세 조회
 * - GET /affiliationRequests/:id
 */
export const affiliationRequestDetailController = async (req, res) => {
  const { id } = req.params;

  const response = await getAffiliationRequestById(id);
  res.status(response.status).json(response);
};

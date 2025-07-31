import { handleAffiliationApproval } from "../services/affiliationApproveService.js";

export const approveAffiliationRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await handleAffiliationApproval(requestId);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "소속 승인 중 오류 발생", error: err.message });
  }
};

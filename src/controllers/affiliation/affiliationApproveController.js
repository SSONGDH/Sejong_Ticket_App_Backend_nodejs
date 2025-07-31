export const approveAffiliationRequest = async (req, res) => {
  try {
    const requestId = req.query.requestId; // 쿼리 파라미터로 받음

    if (!requestId) {
      return res.status(400).json({ message: "requestId가 필요합니다." });
    }

    const result = await handleAffiliationApproval(requestId);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "소속 승인 중 오류 발생", error: err.message });
  }
};

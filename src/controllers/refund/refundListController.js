import { getRefundList } from "../../services/refund/refundListService.js";

export const refundListController = async (req, res) => {
  try {
    const result = await getRefundList();

    if (!result) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0001",
        message: "환불 내역이 없습니다.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result,
    });
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
};

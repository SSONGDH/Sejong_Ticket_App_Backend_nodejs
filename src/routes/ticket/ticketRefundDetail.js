import express from "express";
import Refund from "../../models/refundModel.js";
import Ticket from "../../models/ticketModel.js";

const router = express.Router();

// 티켓에 대한 환불 상세 조회 API (쿼리 파라미터 사용)
router.get("/ticketRefundDetail", async (req, res) => {
  const { ticketId } = req.query; // ✅ 쿼리 파라미터에서 ticketId 추출

  if (!ticketId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0000",
      message: "ticketId 쿼리 파라미터가 필요합니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ 환불 내역 조회
    const refund = await Refund.findOne({ ticketId });

    if (!refund) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0001",
        message: "환불 내역이 없습니다.",
        result: [],
      });
    }

    // 2️⃣ 해당 티켓 정보 조회
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "티켓 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    // 3️⃣ 환불 상세 정보 반환
    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "환불 상세 정보를 가져왔습니다.",
      result: {
        name: refund.name,
        eventName: ticket.eventTitle,
        visitDate: refund.visitDate,
        visitTime: refund.visitTime,
        refundPermissionStatus: refund.refundPermissionStatus
          ? "승인됨"
          : "미승인",
        refundReason: refund.refundReason,
        _id: refund._id,
      },
    });
  } catch (error) {
    console.error("❌ 환불 상세 조회 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;

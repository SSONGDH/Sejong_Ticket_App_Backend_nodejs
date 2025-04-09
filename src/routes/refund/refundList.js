import express from "express";
import Refund from "../../models/refundModel.js"; // Refund 모델 가져오기
import Ticket from "../../models/ticketModel.js"; // Ticket 모델 가져오기

const router = express.Router();

// 환불 리스트 조회 API
router.get("/refund/refundList", async (req, res) => {
  try {
    const refunds = await Refund.find();

    if (!refunds || refunds.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0001",
        message: "환불 내역이 없습니다.",
      });
    }

    // 환불 내역과 해당 이벤트 이름을 조합
    const result = await Promise.all(
      refunds.map(async (refund) => {
        const ticket = await Ticket.findById(refund.ticketId); // refund에서 ticketId를 가져와 Ticket 조회
        const eventName = ticket ? ticket.eventTitle : "이벤트 정보 없음"; // 이벤트명 (티켓에서 가져옴)

        return {
          name: refund.name,
          eventName: eventName, // ticketDB에서 eventTitle을 가져와 표시
          visitDate: refund.visitDate,
          visitTime: refund.visitTime,
          refundPermissionStatus: refund.refundPermissionStatus
            ? "TRUE"
            : "FALSE",
          refundReason: refund.refundReason, // 환불 사유 추가
          _id: refund._id,
        };
      })
    );

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
});

export default router;

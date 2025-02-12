import express from "express";
import Refund from "../models/refundModel.js"; // Refund 모델 가져오기
import Ticket from "../models/ticketModel.js"; // Ticket 모델 가져오기

const router = express.Router();

// 환불 상세 조회 API
router.get("/refund/refundDetail", async (req, res) => {
  const { refundId } = req.query; // GET 요청이므로 req.query에서 _id 받음

  // _id가 제공되지 않은 경우 에러 반환
  if (!refundId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "필수 데이터가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ refunds 컬렉션에서 _id를 기준으로 환불 데이터 찾기
    const refund = await Refund.findById(refundId);

    if (!refund) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 환불 요청을 찾을 수 없습니다.",
        result: [],
      });
    }

    // 2️⃣ ticketDB에서 해당 ticketId에 해당하는 이벤트 제목(eventTitle) 찾기
    const ticket = await Ticket.findById(refund.ticketId);

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result: {
        eventTitle: ticket ? ticket.eventTitle : "알 수 없는 이벤트",
        name: refund.name,
        studentId: refund.studentId,
        phone: refund.phone,
        refundReason: refund.refundReason,
        visitDate: refund.visitDate,
        visitTime: refund.visitTime,
      },
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

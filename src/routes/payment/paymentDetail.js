import express from "express";
import Payment from "../../models/paymentModel.js"; // Payment 모델 가져오기
import Ticket from "../../models/ticketModel.js"; // Ticket 모델 가져오기

const router = express.Router();

// ✅ 납부 내역 상세 조회 API (GET 방식)
router.get("/payment/paymentDetail", async (req, res) => {
  const { paymentId } = req.query; // 쿼리 파라미터로 paymentId 받기

  // ✅ paymentId가 제공되지 않은 경우 에러 반환
  if (!paymentId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "필수 데이터가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ Payment 컬렉션에서 paymentId로 결제 정보 찾기
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 납부 내역을 찾을 수 없습니다.",
        result: [],
      });
    }

    // 2️⃣ Ticket 컬렉션에서 ticketId를 사용하여 이벤트 정보 찾기 (사진 포함)
    const ticket = await Ticket.findById(payment.ticketId);

    if (!ticket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 이벤트를 찾을 수 없습니다.",
        result: [],
      });
    }

    // ✅ 사진 URL 포함하여 응답 반환
    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result: {
        ticketId: payment.ticketId,
        paymentId: payment._id,
        name: payment.name,
        studentId: payment.studentId,
        phone: payment.phone,
        eventTitle: ticket.eventTitle, // 티켓 제목
        eventPlacePicture: ticket.eventPlacePicture, // 티켓 장소 사진 URL 추가
      },
    });
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0004",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;

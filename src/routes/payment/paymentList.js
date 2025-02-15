import express from "express";
import Payment from "../../models/paymentModel.js"; // Payment 모델 가져오기

const router = express.Router();

// 납부내역 조회 API (GET 방식) - 필요한 필드만 반환
router.get("/payment/paymentlist", async (req, res) => {
  try {
    // 1️⃣ Payment 컬렉션에서 모든 결제 정보 조회
    const payments = await Payment.find();

    // 데이터가 없을 경우
    if (payments.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "납부 내역이 없습니다.",
        result: [],
      });
    }

    // 2️⃣ 필요한 필드만 응답으로 반환 (paymentPermissionStatus 추가)
    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result: payments.map((payment) => ({
        ticketId: payment.ticketId,
        paymentId: payment._id, // 고유 ID
        name: payment.name,
        studentId: payment.studentId,
        paymentPermissionStatus: payment.paymentPermissionStatus, // 추가된 필드
      })),
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

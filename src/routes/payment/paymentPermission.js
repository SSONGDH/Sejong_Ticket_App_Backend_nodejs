import express from "express";
import Payment from "../../models/paymentModel.js"; // Payment 모델 가져오기

const router = express.Router();

// 결제 승인 상태 변경 (PUT 방식)
router.put("/payment/paymentPermission", async (req, res) => {
  const { paymentId } = req.query; // 쿼리 스트링에서 paymentId 받기

  // paymentId가 제공되지 않으면 에러 반환
  if (!paymentId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "paymentId가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ paymentId로 해당 결제 찾기
    const payment = await Payment.findById(paymentId);

    // 결제를 찾지 못한 경우
    if (!payment) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 결제 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    // 2️⃣ paymentPermissionStatus를 TRUE로 변경
    payment.paymentPermissionStatus = true;

    // 3️⃣ 변경된 결제 정보 저장
    await payment.save();

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "결제 승인 상태가 성공적으로 변경되었습니다.",
      result: {
        paymentId: payment._id,
        paymentPermissionStatus: payment.paymentPermissionStatus,
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

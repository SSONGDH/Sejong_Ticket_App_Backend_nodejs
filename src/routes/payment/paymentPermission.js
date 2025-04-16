import express from "express";
import Payment from "../../models/paymentModel.js"; // Payment 모델
import User from "../../models/userModel.js"; // User 모델

const router = express.Router();

// 결제 승인 상태 변경 (PUT 방식)
router.put("/payment/paymentPermission", async (req, res) => {
  const { paymentId } = req.query;

  if (!paymentId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "paymentId가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ Payment 문서 찾기
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 결제 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    // 2️⃣ 결제 승인 처리
    payment.paymentPermissionStatus = true;
    await payment.save();

    // 3️⃣ 해당 유저 찾기 (studentId 기준)
    const user = await User.findOne({ studentId: payment.studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "해당 유저 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    // 4️⃣ 중복 없이 티켓 ID 추가
    if (!user.tickets.includes(payment.ticketId)) {
      user.tickets.push(payment.ticketId);
      await user.save();
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message:
        "결제 승인 상태가 성공적으로 변경되었고, 유저 티켓에 추가되었습니다.",
      result: {
        paymentId: payment._id,
        paymentPermissionStatus: payment.paymentPermissionStatus,
        userId: user._id,
        updatedTickets: user.tickets,
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

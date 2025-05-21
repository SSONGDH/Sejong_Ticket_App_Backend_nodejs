import express from "express";
import Refund from "../../models/refundModel.js";
import User from "../../models/userModel.js"; // ✅ 유저 모델 추가
import sendRefundNotification from "../../routes/FCM/sendRefundNotification.js";

const router = express.Router();

// 환불 승인 API
router.put("/refund/refundPermission", async (req, res) => {
  const { refundId } = req.query;

  if (!refundId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "필수 데이터가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ 해당 refundId의 환불 요청 찾기
    const refund = await Refund.findById(refundId);

    if (!refund) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 환불 요청을 찾을 수 없습니다.",
        result: [],
      });
    }

    // 2️⃣ refundPermissionStatus를 TRUE로 변경
    refund.refundPermissionStatus = true;
    await refund.save();

    // 3️⃣ 환불 신청자의 이름/학과/학번으로 유저 조회
    const user = await User.findOne({
      name: refund.name,
      department: refund.department,
      studentId: refund.studentId,
    });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "유저 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    // 4️⃣ 환불 승인 알림 전송
    await sendRefundNotification(user._id); // 유저의 _id 전달

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "환불 요청이 승인되었습니다.",
      result: {
        refundId: refund._id,
        refundPermissionStatus: refund.refundPermissionStatus,
      },
    });
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;

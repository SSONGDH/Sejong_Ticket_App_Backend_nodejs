import express from "express";
import Refund from "../models/refundModel.js"; // Refund 모델 불러오기

const router = express.Router();

// 환불 승인 API
router.put("/refund/refundPermission", async (req, res) => {
  const { _id } = req.query; // Query String으로 _id 받기

  // _id가 제공되지 않은 경우 에러 반환
  if (!_id) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "필수 데이터가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ 해당 _id의 환불 요청 찾기
    const refund = await Refund.findById(_id);

    if (!refund) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 환불 요청을 찾을 수 없습니다.",
        result: [],
      });
    }

    // 2️⃣ permissionStatus를 TRUE로 변경
    refund.permissionStatus = true;
    await refund.save();

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "환불 요청이 승인되었습니다.",
      result: {
        _id: refund._id,
        permissionStatus: refund.permissionStatus, // TRUE로 변경된 값
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

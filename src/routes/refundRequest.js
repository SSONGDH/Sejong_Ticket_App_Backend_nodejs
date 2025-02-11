import express from "express";
import Refund from "../models/refundModel.js"; // refund 모델 불러오기
import User from "../models/userModel.js"; // user 모델 불러오기

const router = express.Router();

// 환불 요청 처리
router.post("/refund/request", async (req, res) => {
  const {
    name,
    studentId,
    phone,
    refundReason,
    visitDate,
    visitTime,
    ticketId,
  } = req.body;

  // 요청 데이터가 모두 있는지 확인
  if (
    !name ||
    !studentId ||
    !phone ||
    !refundReason ||
    !visitDate ||
    !visitTime ||
    !ticketId
  ) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "필수 데이터가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // 환불 요청 데이터를 refund 컬렉션에 저장
    const newRefund = new Refund({
      ticketId, // 중복 가능한 ticketId
      name,
      studentId,
      phone,
      refundReason,
      visitDate,
      visitTime,
      permissionStatus: false, // 기본값을 false로 설정
    });

    // 환불 데이터를 DB에 저장
    const savedRefund = await newRefund.save();

    // 사용자 데이터에서 해당 studentId로 사용자를 찾고, refunds 배열에 새로운 refund _id 추가
    const user = await User.findOne({ studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 사용자를 찾을 수 없습니다.",
        result: [],
      });
    }

    // refunds 배열에 새로운 refund _id 추가
    user.refunds.push(savedRefund._id);

    // 업데이트된 사용자 정보 저장
    await user.save();

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "환불 요청이 성공적으로 처리되었습니다.",
      result: savedRefund,
    });
  } catch (error) {
    console.error("환불 저장 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;

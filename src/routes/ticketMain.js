import express from "express";
import Ticket from "../models/ticketModel.js"; // 티켓 모델 불러오기
import User from "../models/userModel.js"; // 유저 모델 불러오기
import verifySSOService from "../service/ssoAuth.js"; // SSO 인증 서비스 불러오기

const router = express.Router();

router.get("/ticket/main", async (req, res) => {
  const ssotoken =
    req.headers.authorization?.split(" ")[1] || req.query.ssotoken;

  if (!ssotoken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "SSO 토큰이 없습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ SSO 토큰을 검증하여 유저 프로필 가져오기
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

    if (!userProfile || !userProfile.studentId) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "SSO 인증 실패",
        result: [],
      });
    }

    // 2️⃣ 유저 DB에서 학번(studentId)으로 유저 찾기
    const user = await User.findOne({ studentId: userProfile.studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "유저 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    // 3️⃣ 유저가 등록한 티켓 목록 조회 (populate로 티켓 정보 가져오기)
    const ticketIds = user.tickets;

    if (!ticketIds || ticketIds.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "등록된 티켓 데이터가 없습니다.",
        result: [],
      });
    }

    // 4️⃣ 티켓 ID를 기반으로 티켓 데이터 조회
    const tickets = await Ticket.find({
      _id: { $in: ticketIds },
    });

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "등록된 티켓 데이터가 없습니다.",
        result: [],
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result: tickets.map((ticket) => ({
        _id: ticket._id,
        eventTitle: ticket.eventTitle,
        eventDay: ticket.eventDay,
        eventStartTime: ticket.eventStartTime, // ⏰ 시작 시간 추가
        eventEndTime: ticket.eventEndTime, // ⏰ 종료 시간 추가
        eventPlace: ticket.eventPlace,
      })),
    });
  } catch (error) {
    console.error("❌ 티켓 조회 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0005",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;

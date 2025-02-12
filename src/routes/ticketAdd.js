import express from "express";
import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import verifySSOService from "../service/ssoAuth.js"; // SSO 검증 서비스

const router = express.Router();

router.post("/ticket/add", async (req, res) => {
  const { eventCode } = req.body;
  const authHeader = req.headers.authorization; // Bearer 토큰 형식

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "유효한 Authorization 헤더가 필요합니다.",
    });
  }

  const ssoToken = authHeader.split(" ")[1]; // "Bearer TOKEN_VALUE"에서 토큰 값만 추출

  if (!eventCode || !ssoToken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "eventCode 또는 SSO 토큰이 누락되었습니다.",
    });
  }

  try {
    // 1️⃣ SSO 토큰으로 유저 정보 가져오기
    const userProfile = await verifySSOService.verifySSOToken(ssoToken);
    if (!userProfile) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0007",
        message: "유효하지 않은 SSO 토큰입니다.",
      });
    }

    // 2️⃣ 해당 eventCode에 해당하는 티켓 찾기
    const ticket = await Ticket.findOne({ eventCode });
    if (!ticket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "해당 eventCode의 티켓을 찾을 수 없습니다.",
      });
    }

    // 3️⃣ SSO 토큰을 통해 얻은 유저 정보로 유저 찾기
    const user = await User.findOne({ studentId: userProfile.studentId });
    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0005",
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    // 4️⃣ 유저의 티켓 목록에 추가 (중복 방지)
    if (!user.tickets) {
      user.tickets = [];
    }
    if (!user.tickets.includes(ticket._id)) {
      user.tickets.push(ticket._id);
      await user.save();
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0001",
      message: "티켓이 사용자에게 성공적으로 추가되었습니다.",
      result: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0006",
      message: "서버 오류 발생",
    });
  }
});

export default router;

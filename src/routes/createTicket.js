import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/ticketModel"; // 티켓 모델 불러오기

const router = express.Router();

// POST /ticket/createTicket - 티켓 생성
router.post("/ticket/createTicket", async (req, res) => {
  const { eventTitle, eventDay, eventTime, eventPlace, eventPlaceComment, eventComment } = req.body;

  // 필수 값이 없으면 에러 처리
  if (!eventTitle || !eventDay || !eventTime || !eventPlace || !eventPlaceComment || !eventComment) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "모든 필드를 채워주세요.",
    });
  }

  try {
    // 새로운 티켓 객체 생성
    const newTicket = new Ticket({
      eventTitle,
      eventDay,
      eventTime,
      eventPlace,
      eventPlaceComment,
      eventComment,
    });

    // DB에 저장
    const savedTicket = await newTicket.save();

    // 성공 응답
    return res.status(201).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "이벤트가 성공적으로 생성되었습니다.",
      result: savedTicket,
    });
  } catch (error) {
    // 오류 응답
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;

import express from "express";
import multer from "multer";
import path from "path";
import Ticket from "../models/ticketModel.js"; // 티켓 모델
import moment from "moment"; // 날짜 처리 라이브러리

const router = express.Router();

/**
 * 랜덤한 고유 eventCode 생성 (중복 방지)
 */
const generateUniqueEventCode = async () => {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const existingTicket = await Ticket.findOne({ eventCode: uniqueCode });
    if (!existingTicket) {
      isUnique = true;
    }
  }

  return uniqueCode;
};

// ✅ 이미지 업로드를 위한 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/eventPlacePictures/"); // 'uploads/eventPictures/' 폴더에 저장
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // 고유한 파일명 생성
  },
});

const upload = multer({ storage: storage });

// ✅ 티켓 생성 API
router.post(
  "/ticket/createTicket",
  upload.single("eventPlacePicture"),
  async (req, res) => {
    const {
      eventTitle,
      eventDay,
      eventStartTime,
      eventEndTime,
      eventPlace,
      eventPlaceComment,
      eventComment,
      eventCode,
    } = req.body;

    // ✅ 필수 필드 확인
    if (
      !eventTitle ||
      !eventDay ||
      !eventStartTime ||
      !eventEndTime ||
      !eventPlace ||
      !eventPlaceComment ||
      !eventComment
    ) {
      return res.status(400).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "모든 필드를 채워주세요.",
      });
    }

    try {
      let finalEventCode =
        eventCode && eventCode.trim() !== "" ? eventCode : null;

      // ✅ eventCode 중복 검사
      if (finalEventCode) {
        const existingTicket = await Ticket.findOne({
          eventCode: finalEventCode,
        });

        if (existingTicket) {
          return res.status(400).json({
            isSuccess: false,
            code: "ERROR-0004",
            message: "이벤트 코드가 중복됩니다. 다른 코드를 사용해주세요.",
          });
        }
      } else {
        // ✅ eventCode가 없으면 중복되지 않는 값 생성
        finalEventCode = await generateUniqueEventCode();
      }

      // ✅ eventStartTime과 eventEndTime을 HH:mm:ss 형식으로 포맷팅
      const formattedEventStartTime = moment(eventStartTime, "HH:mm:ss").format(
        "HH:mm:ss"
      );
      const formattedEventEndTime = moment(eventEndTime, "HH:mm:ss").format(
        "HH:mm:ss"
      );

      // ✅ 업로드된 파일의 URL 생성 (파일이 있을 경우만)
      const eventPlacePicture = req.file
        ? `${req.protocol}://${req.get("host")}/eventUploads/${
            req.file.filename
          }`
        : null;

      // ✅ 새로운 티켓 생성
      const newTicket = new Ticket({
        eventTitle,
        eventDay,
        eventStartTime: formattedEventStartTime,
        eventEndTime: formattedEventEndTime,
        eventPlace,
        eventPlaceComment,
        eventComment,
        eventCode: finalEventCode,
        eventPlacePicture, // 📸 이미지 URL 저장
      });

      const savedTicket = await newTicket.save();

      return res.status(201).json({
        isSuccess: true,
        code: "SUCCESS-0000",
        message: "이벤트가 성공적으로 생성되었습니다.",
        result: savedTicket,
      });
    } catch (error) {
      console.error("❌ 오류 발생:", error);

      return res.status(500).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "서버 오류",
        result: [],
      });
    }
  }
);

export default router;

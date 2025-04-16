import express from "express";
import multer from "multer";
import moment from "moment"; // 날짜 변환을 위해 moment.js 추가
import Ticket from "../../models/ticketModel.js"; // 티켓 모델 불러오기

const router = express.Router();

// ✅ 이미지 업로드를 위한 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/eventPlacePictures/"); // 실제 저장 위치
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // 고유한 파일명 생성
  },
});

const upload = multer({ storage: storage });

// ✅ 티켓 수정 API (사진 포함)
router.put(
  "/ticket/modifyTicket",
  upload.single("eventPlacePicture"), // 사진 파일을 받기 위해 multer 적용
  async (req, res) => {
    const {
      _id,
      eventTitle,
      eventDay,
      eventStartTime,
      eventEndTime,
      eventPlace,
      eventPlaceComment,
      eventComment,
      eventCode, // 이벤트 코드 추가
    } = req.body;

    if (!_id) {
      return res.status(400).json({
        isSuccess: false,
        code: "ERROR-0001",
        message: "수정할 티켓의 _id가 없습니다.",
        result: [],
      });
    }

    try {
      // 기존 티켓 가져오기
      const existingTicket = await Ticket.findById(_id);

      if (!existingTicket) {
        return res.status(404).json({
          isSuccess: false,
          code: "ERROR-0003",
          message: "해당 _id의 티켓을 찾을 수 없습니다.",
          result: [],
        });
      }

      // 시간 형식이 "HH:mm:ss" 이므로 변환 후 저장
      const formattedStartTime = eventStartTime
        ? moment(eventStartTime, "HH:mm:ss").format("HH:mm:ss")
        : existingTicket.eventStartTime;

      const formattedEndTime = eventEndTime
        ? moment(eventEndTime, "HH:mm:ss").format("HH:mm:ss")
        : existingTicket.eventEndTime;

      // 이미지 업로드 시 URL 업데이트
      const eventPlacePicture = req.file
        ? `${req.protocol}://${req.get("host")}/eventUploads/${
            req.file.filename
          }`
        : existingTicket.eventPlacePicture;

      // 티켓 정보 업데이트
      const updatedTicket = await Ticket.findByIdAndUpdate(
        _id,
        {
          eventTitle,
          eventDay,
          eventStartTime: formattedStartTime,
          eventEndTime: formattedEndTime,
          eventPlace,
          eventPlaceComment,
          eventComment,
          eventCode,
          eventPlacePicture,
        },
        { new: true }
      );

      return res.status(200).json({
        isSuccess: true,
        code: "SUCCESS-0000",
        message: "티켓 정보가 성공적으로 수정되었습니다.",
        result: updatedTicket,
      });
    } catch (error) {
      console.error("❌ 티켓 수정 중 오류 발생:", error);
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

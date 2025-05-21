import express from "express";
import multer from "multer";
import moment from "moment";
import Ticket from "../../models/ticketModel.js";

const router = express.Router();

// ✅ 이미지 업로드를 위한 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/eventPlacePictures/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ✅ 티켓 수정 API
router.put(
  "/ticket/modifyTicket",
  upload.single("eventPlacePicture"),
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
      eventCode,
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

      // 시간 포맷 변환
      const formattedStartTime = eventStartTime
        ? moment(eventStartTime, "HH:mm:ss").format("HH:mm:ss")
        : existingTicket.eventStartTime;

      const formattedEndTime = eventEndTime
        ? moment(eventEndTime, "HH:mm:ss").format("HH:mm:ss")
        : existingTicket.eventEndTime;

      // 시작 시간이 기존과 다르면 reminderSent 초기화
      let reminderSent = existingTicket.reminderSent;
      if (formattedStartTime !== existingTicket.eventStartTime) {
        reminderSent = false;
      }

      // 이미지 처리
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
          reminderSent,
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

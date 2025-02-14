import mongoose from "mongoose";

// ticketDB에 연결하기 위한 연결 객체 생성
const ticketDB = mongoose.createConnection(process.env.MONGO_TICKET_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ticketDB에서 사용할 스키마 정의
const ticketSchema = new mongoose.Schema({
  eventTitle: String,
  eventDay: String,
  eventStartTime: String,
  eventEndTime: String,
  eventPlace: String,
  eventPlaceComment: String,
  eventComment: String,
  eventCode: String,
});

// ticketDB에서 사용할 모델 정의
const Ticket = ticketDB.model("Ticket", ticketSchema);

export default Ticket;

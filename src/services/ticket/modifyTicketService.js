import Ticket from "../../models/ticketModel.js";
import moment from "moment";

export const modifyTicket = async (body, file, req) => {
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
  } = body;

  if (!_id) {
    return {
      status: 400,
      code: "ERROR-0001",
      message: "수정할 티켓의 _id가 없습니다.",
    };
  }

  const existingTicket = await Ticket.findById(_id);
  if (!existingTicket) {
    return {
      status: 404,
      code: "ERROR-0003",
      message: "해당 _id의 티켓을 찾을 수 없습니다.",
    };
  }

  const formattedStartTime = eventStartTime
    ? moment(eventStartTime, "HH:mm:ss").format("HH:mm:ss")
    : existingTicket.eventStartTime;

  const formattedEndTime = eventEndTime
    ? moment(eventEndTime, "HH:mm:ss").format("HH:mm:ss")
    : existingTicket.eventEndTime;

  let reminderSent = existingTicket.reminderSent;
  if (formattedStartTime !== existingTicket.eventStartTime) {
    reminderSent = false;
  }

  const eventPlacePicture = file
    ? `${req.protocol}://${req.get("host")}/eventUploads/${file.filename}`
    : existingTicket.eventPlacePicture;

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

  return {
    status: 200,
    code: "SUCCESS-0000",
    message: "티켓 정보가 성공적으로 수정되었습니다.",
    result: updatedTicket,
  };
};

import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import Payment from "../../models/paymentModel.js";
import verifySSOService from "../../services/ssoAuth.js";

export const addTicketForUser = async (eventCode, ssotoken) => {
  if (!ssotoken) {
    return {
      status: 400,
      code: "ERROR-0003",
      message: "SSO 토큰이 없습니다.",
    };
  }
  if (!eventCode) {
    return {
      status: 400,
      code: "ERROR-0003",
      message: "eventCode가 누락되었습니다.",
    };
  }

  // 1️⃣ SSO 토큰으로 유저 정보 가져오기
  const userProfile = await verifySSOService.verifySSOToken(ssotoken);
  if (!userProfile) {
    return {
      status: 401,
      code: "ERROR-0007",
      message: "유효하지 않은 SSO 토큰입니다.",
    };
  }

  // 2️⃣ eventCode로 티켓 조회
  const ticket = await Ticket.findOne({ eventCode });
  if (!ticket) {
    return {
      status: 404,
      code: "ERROR-0004",
      message: "해당 eventCode의 티켓을 찾을 수 없습니다.",
    };
  }

  // 3️⃣ user 조회
  const user = await User.findOne({ studentId: userProfile.studentId });
  if (!user) {
    return {
      status: 404,
      code: "ERROR-0005",
      message: "해당 사용자를 찾을 수 없습니다.",
    };
  }

  // 4️⃣ 유저 티켓 추가
  if (!user.tickets) user.tickets = [];
  if (!user.tickets.includes(ticket._id)) {
    user.tickets.push(ticket._id);
    await user.save();
  }

  // 5️⃣ Payment 문서 생성
  const newPayment = new Payment({
    ticketId: ticket._id.toString(),
    name: user.name,
    studentId: user.studentId,
    phone: "현장 조사 필요",
    major: user.major,
    paymentPicture: "",
    paymentPermissionStatus: true,
    etc: "현장 코드 추가",
  });
  await newPayment.save();

  return {
    status: 200,
    code: "SUCCESS-0001",
    message:
      "티켓이 사용자에게 성공적으로 추가되었고, Payment 문서가 생성되었습니다.",
    result: user,
  };
};

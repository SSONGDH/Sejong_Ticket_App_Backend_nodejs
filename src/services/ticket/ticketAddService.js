import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import Payment from "../../models/paymentModel.js";
// import verifySSOService ... (삭제: 서비스는 이제 인증을 신경 쓰지 않습니다)

/**
 * 유저에게 티켓을 추가하는 서비스 (SSO 토큰 제거 버전)
 * @param {string} eventCode - 이벤트 코드
 * @param {string} studentId - 학번 (컨트롤러에서 넘겨줌)
 */
export const addTicketForUser = async (eventCode, studentId) => {
  // 1. 유효성 검사
  if (!eventCode) {
    return {
      status: 400,
      code: "ERROR-0003",
      message: "eventCode가 누락되었습니다.",
    };
  }

  if (!studentId) {
    return {
      status: 400,
      code: "ERROR-0003",
      message: "studentId가 누락되었습니다.",
    };
  }

  // [삭제됨] verifySSOService.verifySSOToken 호출 로직

  // 2. eventCode로 티켓 조회
  const ticket = await Ticket.findOne({ eventCode });
  if (!ticket) {
    return {
      status: 404,
      code: "ERROR-0004",
      message: "해당 eventCode의 티켓을 찾을 수 없습니다.",
    };
  }

  // 3. user 조회 (studentId로 바로 찾기)
  const user = await User.findOne({ studentId });
  if (!user) {
    return {
      status: 404,
      code: "ERROR-0005",
      message: "해당 사용자를 찾을 수 없습니다.",
    };
  }

  // 4. 소속 확인 (root는 무조건 통과)
  const isRoot = user.root === true;
  const hasAffiliation =
    Array.isArray(user.affiliations) &&
    user.affiliations.some((aff) => aff.name === ticket.affiliation);

  if (!isRoot && !hasAffiliation) {
    return {
      status: 403,
      code: "ERROR-0006",
      message: `해당 티켓(${ticket.affiliation}) 소속이 아니므로 추가할 수 없습니다.`,
    };
  }

  // 5. 유저 티켓 추가
  if (!user.tickets) user.tickets = [];

  // 이미 있는 티켓인지 확인
  if (!user.tickets.includes(ticket._id)) {
    user.tickets.push(ticket._id);
    await user.save();
  } else {
    // (선택사항) 이미 티켓이 있다면?
    // 현재 로직은 에러를 뱉지 않고 Payment 생성을 진행하지만,
    // 필요하다면 여기서 return { status: 409, message: "이미 등록된 티켓입니다." } 할 수도 있음.
  }

  // 6. Payment 문서 생성 (현장 추가용)
  const newPayment = new Payment({
    ticketId: ticket._id.toString(),
    name: user.name,
    studentId: user.studentId,
    phone: "현장 조사 필요", // 현장 추가이므로 전화번호는 일단 placeholder
    major: user.major,
    paymentPicture: "", // 현장 결제라 사진 없음
    paymentPermissionStatus: true, // 현장이므로 즉시 승인
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

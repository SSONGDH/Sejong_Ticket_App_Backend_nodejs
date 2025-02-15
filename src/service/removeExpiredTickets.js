import User from "../models/userModel.js";
import Ticket from "../models/ticketModel.js"; // 티켓 모델
import moment from "moment"; // 날짜 비교를 위한 라이브러리

const removeExpiredTicketsFromUsers = async () => {
  try {
    // 1. 현재 시간을 가져오기
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    // 2. 종료 시간이 지난 티켓을 조회
    const expiredTickets = await Ticket.find();

    // 종료된 티켓이 없으면 종료
    if (expiredTickets.length === 0) {
      console.log("❌ 종료된 티켓이 없습니다.");
      return;
    }

    // 3. 종료된 티켓에 대한 처리
    for (const ticket of expiredTickets) {
      // 4. eventDay와 eventEndTime을 합쳐서 종료 시간을 계산
      const eventEndDateTime = moment(
        `${ticket.eventDay} ${ticket.eventEndTime}`,
        "YYYY-MM-DD HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss");

      // 5. 종료 시간이 현재 시간보다 작은 티켓만 필터링
      if (moment(eventEndDateTime).isBefore(currentTime)) {
        // 종료된 티켓에 등록된 모든 유저 찾기
        const users = await User.find({ tickets: ticket._id });

        for (const user of users) {
          // 유저가 해당 티켓을 등록했다면, 해당 티켓을 UserDB에서 제거
          await User.updateOne(
            { _id: user._id },
            { $pull: { tickets: ticket._id } } // tickets 배열에서 티켓 ID를 제거
          );

          console.log(
            `✅ ${user.name}의 등록된 티켓 ${ticket.eventTitle}을(를) 제거했습니다.`
          );
        }
      }
    }

    console.log("✅ 종료된 티켓에 대한 처리가 완료되었습니다.");
  } catch (error) {
    console.error("❌ 종료된 티켓 제거 작업 실패:", error);
  }
};

export default removeExpiredTicketsFromUsers;

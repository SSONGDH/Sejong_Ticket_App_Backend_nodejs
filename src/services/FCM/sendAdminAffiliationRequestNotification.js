import moment from "moment-timezone";
import admin from "../../config/firebaseConfig.js";

const sendAdminAffiliationRequestNotification = async (tokens, request) => {
  try {
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      `📢 소속 신청 알림 함수 호출됨: ${request._id}`
    );

    if (!tokens || tokens.length === 0) {
      console.log(
        moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
        "⚠️ 알림 대상 토큰이 없습니다."
      );
      return;
    }

    for (const token of tokens) {
      const message = {
        token: token,
        notification: {
          title: "새 소속 신청 요청",
          body: `${request.userName} 님이 ${request.affiliation} 소속 신청을 요청했습니다.`,
        },
        data: {
          type: "AFFILIATION_REQUEST",
          requestId: String(request._id),
          userName: String(request.userName),
          affiliation: String(request.affiliation), // 반드시 문자열로 변환
        },
      };

      try {
        await admin.messaging().send(message);
        console.log(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `✅ 토큰 ${token}에게 알림 전송 완료`
        );
      } catch (sendError) {
        console.error(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `❌ 토큰 ${token} 알림 전송 실패:`,
          sendError
        );
      }
    }
  } catch (error) {
    console.error(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "❌ 소속 신청 알림 전송 실패:",
      error
    );
    throw error;
  }
};

export default sendAdminAffiliationRequestNotification;

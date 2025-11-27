import moment from "moment-timezone";
import admin from "../../config/firebaseConfig.js";

const sendAdminAffiliationRequestNotification = async (tokens, request) => {
  try {
    if (!tokens || tokens.length === 0) {
      return;
    }

    for (const token of tokens) {
      const message = {
        token: token,
        notification: {
          title: "새 소속 신청 요청",
          body: `${request.name} 님이 ${request.affiliationName} 소속 신청을 요청했습니다.`,
        },
        data: {
          type: "AFFILIATION_REQUEST",
          requestId: String(request._id),
          userName: String(request.name),
          affiliation: String(request.affiliationName),
        },
      };

      try {
        await admin.messaging().send(message);
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

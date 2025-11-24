import admin from "../../config/firebaseConfig.js";

const sendAdminAffiliationRequestNotification = async (tokens, request) => {
  const message = {
    notification: {
      title: "새 소속 신청 요청",
      body: `${request.userName} 님이 ${request.affiliation} 소속 신청을 요청했습니다.`,
    },
    tokens: tokens,
  };

  return admin.messaging().sendMulticast(message);
};

export default sendAdminAffiliationRequestNotification;

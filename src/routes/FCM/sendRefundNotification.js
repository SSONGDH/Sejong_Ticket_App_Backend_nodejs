//import admin from "../../config/firebaseConfig.js";
import User from "../../models/userModel.js"; // 유저 모델

const sendRefundNotification = async (userId) => {
  try {
    // 유저 정보 가져오기
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) return;

    // FCM 메시지 설정
    const message = {
      token: user.fcmToken,
      notification: {
        title: "환불 승인 완료",
        body: "환불이 승인되었습니다. 계좌를 확인해주세요!",
      },
      data: {
        type: "REFUND_APPROVED",
        userId: user._id.toString(),
      },
    };

    // FCM 메시지 전송
    await admin.messaging().send(message);
    console.log(`✅ ${user.name}에게 환불 승인 알림 전송 완료`);
  } catch (error) {
    console.error("❌ 환불 승인 알림 전송 실패:", error);
  }
};

export default sendRefundNotification;

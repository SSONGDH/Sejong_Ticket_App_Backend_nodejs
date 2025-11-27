import admin from "../../config/firebaseConfig.js";
import User from "../../models/userModel.js";

const sendRefundNotification = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.fcmToken || !user.notification) {
    return;
  }

  const message = {
    token: user.fcmToken,
    notification: {
      title: "환불 승인 완료",
      body: "환불이 승인되었습니다. 방문날짜를 확인해주세요",
    },
    data: {
      type: "REFUND_APPROVED",
      userId: user._id.toString(),
    },
  };

  await admin.messaging().send(message);
};

export default sendRefundNotification;

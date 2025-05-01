// testFirebase.js
import admin from "./src/config/firebaseConfig.js";

// Firebase Admin SDK가 제대로 초기화되었는지 확인하는 간단한 테스트 코드
const testFirebaseSetup = async () => {
  try {
    // Firebase Admin SDK가 초기화되었으므로 인증된 서비스 계정을 사용하여 Firebase 서비스에 접근할 수 있어야 합니다.
    console.log("실행");
    console.log(admin); // Firebase Admin SDK를 제대로 가져온 경우 출력이 됩니다.
    // 예시로 Firebase Cloud Messaging(FCM)을 통해 알림을 보내는 테스트
    const message = {
      notification: {
        title: "테스트 알림",
        body: "Firebase Admin SDK가 정상적으로 설정되었습니다.",
      },
      token: "FCM 토큰을 여기에 입력", // FCM 토큰을 여기에 입력
    };

    // FCM 메시지 전송
    const response = await admin.messaging().send(message);
    console.log("알림 전송 성공:", response);
  } catch (error) {
    console.error("Firebase 설정 테스트 중 오류 발생:", error);
  }
};

testFirebaseSetup();

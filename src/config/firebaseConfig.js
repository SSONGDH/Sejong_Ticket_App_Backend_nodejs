import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// 환경 변수에서 Base64로 인코딩된 서비스 계정 키를 가져와 디코딩
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString(
    "utf-8"
  )
);

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

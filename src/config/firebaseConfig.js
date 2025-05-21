// firebaseConfig.js
import admin from "firebase-admin";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// 현재 디렉토리 경로 처리
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.resolve(
  __dirname,
  "../../firebase/passtime-95bad-firebase-adminsdk-fbsvc-7b019cd11f.json"
);

// JSON 직접 읽어서 파싱 (file:// 문제 없이 동작)
const rawJson = await fs.readFile(serviceAccountPath, "utf-8");
const serviceAccount = JSON.parse(rawJson);

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

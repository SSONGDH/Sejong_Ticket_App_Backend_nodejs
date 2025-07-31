import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import db from "./config/db.js";
import routes from "./routes/index.js"; // 메인 API 라우터
import cronJob from "./jobs/cronJob.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 정적 파일 경로 설정
app.use(
  "/eventUploads",
  express.static(path.join(__dirname, "..", "uploads", "eventPlacePictures"))
);
app.use(
  "/paymentPictures",
  express.static(path.join(__dirname, "..", "uploads", "paymentPictures"))
);

// 메인 API 라우터 등록
app.use("/", routes);

// --- Webhook 서버 라우트 추가 ---
app.post("/webhook", async (req, res) => {
  try {
    // TODO: 필요에 따라 인증 검증 코드 작성
    console.log(`[Webhook] Payload received:`, req.body);

    // 예) push 이벤트 감지 시 처리
    const eventType = req.headers["x-github-event"];
    if (eventType === "push") {
      console.log("GitHub push event received!");
      // 여기에 git pull 명령 실행 등 자동 배포 로직 작성 가능
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Webhook error");
  }
});

// 크론 작업 실행
cronJob();

// 서버 실행 및 DB 연결 확인
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${port}`);
  connectToDatabase();
});

function connectToDatabase() {
  db.once("open", () => {
    console.log("✅ Connected to DB");
  });
  db.on("error", (err) => {
    console.error("❌ Error connecting to DB:", err);
  });
}

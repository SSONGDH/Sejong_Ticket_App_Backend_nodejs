import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import moment from "moment-timezone";

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
app.post("/webhook", express.json(), (req, res) => {
  try {
    console.log(`[Webhook] Payload received:`, req.body);

    const eventType = req.headers["x-github-event"];
    if (eventType === "push") {
      console.log(
        "🔔 GitHub push event received. Pulling latest code and restarting server..."
      );

      exec(
        "git pull origin master && pm2 restart SEJONG-PASSTIME",
        (error, stdout, stderr) => {
          if (error) {
            console.error(
              moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
              `❌ 자동배포 실패: ${error.message}`
            );
            return res.status(500).send("자동배포 실패");
          }
          console.log(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `✅ 자동배포 성공:\n${stdout}`
          );
          if (stderr) console.error(`stderr: ${stderr}`);
          res.status(200).send("자동배포 성공");
        }
      );
    } else {
      res.status(200).send("이벤트 무시됨");
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Webhook error");
  }
});

// 크론 작업 실행
cronJob();

// 서버 실행 및 DB 연결 확인
app.listen(port, "0.0.0.0", () => {
  console.log(
    moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    `✅ Server is running on port ${port}`
  );
  connectToDatabase();
});

function connectToDatabase() {
  db.once("open", () => {
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "✅ Connected to DB"
    );
  });
  db.on("error", (err) => {
    console.error(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "❌ Error connecting to DB:",
      err
    );
  });
}

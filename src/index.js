import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import db from "./config/db.js";
import routes from "./routes/index.js"; // 변경: routes/index.js import

import cronJob from "./jobs/cronJob.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

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

// 모든 라우트 한번에 등록
app.use("/", routes);

cronJob();

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
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

import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = 3000; // 원하는 포트 번호

app.use(express.json());

app.post("/webhook", (req, res) => {
  const event = req.headers["x-github-event"];
  console.log("GitHub event received:", event);

  if (event === "push") {
    console.log(
      "🔄 Push event received. Pulling latest code and restarting PM2..."
    );

    // git pull 실행 + pm2 재시작 (앱 이름/ID 변경 가능)
    exec(
      "git pull origin master && pm2 restart SEJONG-PASSTIME",
      (error, stdout, stderr) => {
        if (error) {
          console.error("Error during deployment:", error);
          return res.status(500).send("Deployment failed");
        }
        console.log("Git pull output:", stdout);
        console.log("PM2 restart output:", stderr);
        res.status(200).send("Deployment success");
      }
    );
  } else {
    res.status(200).send("No action for this event");
  }
});

app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});

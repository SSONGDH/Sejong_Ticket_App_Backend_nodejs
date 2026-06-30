import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../../uploads/paymentPictures");

const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
};

export const readPaymentImage = async (paymentPictureUrl) => {
  if (!paymentPictureUrl) return null;

  const marker = "/paymentPictures/";
  const markerIndex = paymentPictureUrl.indexOf(marker);
  if (markerIndex === -1) return null;

  const filename = decodeURIComponent(
    paymentPictureUrl.slice(markerIndex + marker.length).split("?")[0]
  );
  const filePath = path.join(UPLOAD_DIR, filename);

  const buffer = await fs.readFile(filePath);
  return {
    base64: buffer.toString("base64"),
    mimeType: getMimeType(filename),
  };
};

const buildPrompt = ({ paymentName, criteria }) => `
이 이미지는 대학 행사 참가비 송금 캡처 화면입니다.
아래 기준 정보와 비교할 수 있도록 이미지에서 정보를 추출하세요.

[기준 정보]
- 행사 공시일: ${criteria.announcementDate}
- 참가비: ${criteria.participationFee}원
- 계좌 받는 사람: ${criteria.accountHolderName}
- 납부 신청자 이름: ${paymentName}

반드시 아래 JSON 형식만 반환하세요. 다른 텍스트는 포함하지 마세요.
{
  "amount": number | null,
  "date": "YYYY-MM-DD" | null,
  "senderName": string | null,
  "accountHolderName": string | null,
  "isTransferScreenshot": boolean,
  "confidence": number
}

규칙:
- amount는 원 단위 숫자만 (쉼표 제외)
- senderName은 보낸 사람/송금인 이름 (마스킹 포함 그대로, 예: 송*현)
- accountHolderName은 받는 사람/입금계좌 예금주 이름 (마스킹 포함 그대로)
- isTransferScreenshot: 송금/이체 완료 화면이면 true
- confidence: 0~1 사이 추출 신뢰도
`.trim();

export const analyzePaymentImage = async ({ image, paymentName, criteria }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: buildPrompt({ paymentName, criteria }) },
            {
              inline_data: {
                mime_type: image.mimeType,
                data: image.base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API 오류: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini API 응답이 비어 있습니다.");
  }

  const parsed = JSON.parse(text);
  return {
    amount: parsed.amount != null ? Number(parsed.amount) : null,
    date: parsed.date ?? null,
    senderName: parsed.senderName ?? null,
    accountHolderName: parsed.accountHolderName ?? null,
    isTransferScreenshot: Boolean(parsed.isTransferScreenshot),
    confidence: Number(parsed.confidence) || 0,
    model,
  };
};

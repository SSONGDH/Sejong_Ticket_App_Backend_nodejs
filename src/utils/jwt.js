import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret"; // .env 사용 권장

// 1. 토큰 생성 (로그인 성공 시 호출)
export const generateToken = (user) => {
  // 토큰에 담을 정보 (Payload)
  const payload = {
    id: user._id, // DB의 _id
    studentId: user.studentId, // 학번
    isAdmin: user.root || false, // 관리자 여부 등
  };

  // 토큰 발급 (유효기간 1일 설정 예시)
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};

// 2. 토큰 검증 (API 요청 시 호출)
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or Expired Token");
  }
};

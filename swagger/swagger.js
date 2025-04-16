import path from "path"; // path 모듈 추가
import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";

// ES 모듈에서 __dirname 대신 사용할 방법
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

console.log(path.join(__dirname, "../src/routes/**/*.js"));

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "세종대학교 3-1 창의학기제 PASSTIME API 명세서서",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
  },
  apis: ["./src/routes/**/*.js"], // ✅ 상대경로로 바꿈
};

const specs = swaggereJsdoc(options);

export { swaggerUi, specs };

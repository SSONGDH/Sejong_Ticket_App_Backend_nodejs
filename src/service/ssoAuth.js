import fetch from "node-fetch";
import * as cheerio from "cheerio";

class VerifySSOService {
  constructor() {
    this.finalUrl = "https://classic.sejong.ac.kr/classic/reading/status.do";
  }

  /**
   * SSO 토큰을 사용하여 사용자 프로필을 가져오는 함수
   * @param {string} ssotoken - 사용자 SSO 토큰
   * @returns {Promise<object>} - 사용자 프로필 정보 (이름, 학과, 학번, 학년)
   */
  async verifySSOToken(ssotoken) {
    try {
      if (!ssotoken) {
        throw new Error("❌ SSO 토큰이 제공되지 않음");
      }

      // 세종대학교 사이트에 요청 보내기
      const finalResponse = await fetch(this.finalUrl, {
        method: "GET",
        headers: {
          Cookie: `ssotoken=${ssotoken};`,
          "User-Agent": "Mozilla/5.0",
        },
        credentials: "include",
      });

      const html = await finalResponse.text();

      // 응답이 로그인 페이지인지 확인
      if (html.includes("로그인") || html.includes("세종대학교 포털")) {
        throw new Error("❌ SSO 인증 실패: 로그인 페이지가 반환됨");
      }

      // 프로필 데이터 추출
      const profileData = this.extractProfileData(html);
      //console.log("✅ 가져온 사용자 프로필:", profileData);

      return profileData;
    } catch (error) {
      console.error("❌ SSO 토큰 검증 및 프로필 조회 실패:", error);
      throw new Error("Failed: Authentication process failed");
    }
  }

  /**
   * HTML에서 사용자 정보를 추출하는 함수
   * @param {string} html - 응답 HTML 문자열
   * @returns {object} - 학과명, 학번, 이름, 학년 정보
   */
  extractProfileData(html) {
    const $ = cheerio.load(html);

    const major = $("th:contains('학과명')").next().text().trim();
    const studentId = $("th:contains('학번')").next().text().trim();
    const name = $("th:contains('이름')").next().text().trim();
    const gradeLevel = $("th:contains('학년')").next().text().trim();

    if (!major || !studentId || !name || !gradeLevel) {
      throw new Error("❌ 필수 데이터가 누락되었습니다");
    }

    return { major, studentId, name, gradeLevel };
  }
}

// 인스턴스 생성 후 export
const verifySSOService = new VerifySSOService();
export default verifySSOService;

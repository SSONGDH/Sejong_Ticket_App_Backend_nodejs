import Affiliation from "../../models/affiliationModel.js";

export const getAllAffiliations = async () => {
  try {
    // 소속 모두 조회, admins 필드는 ObjectId 배열로 반환됨
    const affiliations = await Affiliation.find({})
      .populate("admins", "name email") // 필요하면 유저 필드 선택 가능 (예: name, email)
      .sort({ createdAt: -1 });

    return {
      status: 200,
      code: "SUCCESS-0001",
      message: "소속 리스트 조회 성공",
      result: affiliations,
    };
  } catch (error) {
    console.error("❌ 소속 리스트 조회 중 오류:", error);
    return {
      status: 500,
      code: "ERROR-0001",
      message: "서버 오류로 소속 리스트 조회 실패",
      result: [],
    };
  }
};

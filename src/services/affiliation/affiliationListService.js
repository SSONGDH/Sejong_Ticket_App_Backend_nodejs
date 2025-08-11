import Affiliation from "../../models/affiliationModel.js";
import User from "../../models/userModel.js";

export const getAllAffiliations = async () => {
  try {
    // 모든 소속 조회 (members 필드 포함)
    const affiliations = await Affiliation.find({})
      .populate("members", "name studentId affiliations") // 멤버 기본 정보 + affiliations 배열
      .sort({ createdAt: -1 });

    // 관리자 여부 추가
    const affiliationsWithAdmins = affiliations.map((aff) => {
      const admins = aff.members.filter((member) => {
        const affData = member.affiliations?.find(
          (a) => a.id?.toString() === aff._id.toString()
        );
        return affData?.admin === true;
      });

      return {
        _id: aff._id,
        name: aff.name,
        membersCount: aff.membersCount,
        members: aff.members,
        admins, // 관리자 멤버 배열
        createdAt: aff.createdAt,
        updatedAt: aff.updatedAt,
      };
    });

    return {
      status: 200,
      code: "SUCCESS-0001",
      message: "소속 리스트 조회 성공",
      result: affiliationsWithAdmins,
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

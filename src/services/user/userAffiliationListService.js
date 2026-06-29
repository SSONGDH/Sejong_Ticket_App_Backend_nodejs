import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js";

const formatAffiliation = (affiliationDoc, admin) => ({
  affiliationId: affiliationDoc._id,
  name: affiliationDoc.name,
  introduction: affiliationDoc.introduction || "",
  admin,
  membersCount: affiliationDoc.membersCount ?? 0,
});

export const getAuthorizedAffiliationsByStudentId = async (studentId) => {
  const user = await User.findOne({ studentId });

  if (!user) {
    const error = new Error("해당 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  if (user.root === true) {
    const affiliations = await Affiliation.find({}).sort({ name: 1 });
    return affiliations.map((aff) => formatAffiliation(aff, true));
  }

  const authorizedAffiliations = (user.affiliations || []).filter(
    (aff) => aff.admin === true
  );

  if (!authorizedAffiliations.length) {
    return [];
  }

  const affiliationNames = authorizedAffiliations.map((aff) => aff.name);
  const affiliationDocs = await Affiliation.find({
    name: { $in: affiliationNames },
  });

  return authorizedAffiliations.map((userAff) => {
    const doc = affiliationDocs.find((d) => d.name === userAff.name);

    if (doc) {
      return formatAffiliation(doc, true);
    }

    return {
      affiliationId: userAff._id || null,
      name: userAff.name,
      introduction: "",
      admin: true,
      membersCount: 0,
    };
  });
};

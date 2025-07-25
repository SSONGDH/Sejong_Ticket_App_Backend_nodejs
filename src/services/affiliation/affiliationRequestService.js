import AffiliationRequest from "../../models/affiliationRequestModel.js";

export const submitAffiliationRequest = async (requestData) => {
  const newRequest = new AffiliationRequest(requestData);
  return await newRequest.save();
};

import AffiliationRequest from "../../models/affiliationRequestModel.js";

const resolveRequestType = (request) => {
  if (request.requestType) return request.requestType;
  return request.createAffiliation ? "create" : "admin";
};

export const denyAffiliationRequest = async (requestId, expectedType) => {
  const request = await AffiliationRequest.findById(requestId);
  if (!request) return { error: "NOT_FOUND" };

  if (request.status !== "pending") {
    return { error: "ALREADY_PROCESSED" };
  }

  const requestType = resolveRequestType(request);
  if (requestType !== expectedType) {
    return { error: "INVALID_TYPE" };
  }

  await AffiliationRequest.deleteOne({ _id: requestId });

  return {
    requestId,
    requestType,
    affiliationName: request.affiliationName,
    studentId: request.studentId,
  };
};

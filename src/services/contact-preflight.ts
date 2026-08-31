import {
  appendContactDetails,
  contactReviewMatches,
  detectMissingContactFields,
  type ContactField,
  type ContactReview,
} from "./contact-info";

export type ContactPreflightResult =
  | { status: "ready"; resume: string; shouldSave: boolean }
  | { status: "missing"; fields: ContactField[] };

export function prepareContactPreflight(
  resume: string,
  review: ContactReview,
): ContactPreflightResult {
  const missingFields = detectMissingContactFields(resume);

  if (missingFields.length === 0) {
    return { status: "ready", resume: resume.trim(), shouldSave: false };
  }

  if (!review.decision || !contactReviewMatches(missingFields, review.reviewedFields)) {
    return { status: "missing", fields: missingFields };
  }

  if (review.decision === "continue") {
    return { status: "ready", resume: resume.trim(), shouldSave: false };
  }

  const updatedResume = appendContactDetails(resume, review.additions);
  const stillMissing = detectMissingContactFields(updatedResume);

  if (stillMissing.length > 0) {
    return { status: "missing", fields: stillMissing };
  }

  return {
    status: "ready",
    resume: updatedResume,
    shouldSave: review.saveToMasterResume,
  };
}

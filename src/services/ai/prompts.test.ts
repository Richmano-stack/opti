import { describe, expect, it } from "vitest";

import { RECRUITER_SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

describe("recruiter system prompt", () => {
  it("leads the résumé with experience and keeps certifications out of skills", () => {
    expect(RECRUITER_SYSTEM_PROMPT).toContain(
      "contact → headline → summary → experience → skills → education → certifications → projects",
    );
    expect(RECRUITER_SYSTEM_PROMPT).toContain("Do not place certifications");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("at most 12 skills");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("at most 6 bullets");
  });

  it("writes a target-domain headline without overstating the candidate", () => {
    expect(RECRUITER_SYSTEM_PROMPT).toContain("Align it with the target job's title and domain.");
    expect(RECRUITER_SYSTEM_PROMPT).toContain(
      "Never use the candidate's latest job title when it belongs to a different domain from the target job.",
    );
    expect(RECRUITER_SYSTEM_PROMPT).toContain(
      "Never claim a seniority, licence, or credential in the headline that the master resume does not show.",
    );
  });

  it("filters by the job's domain in either direction and keeps every role", () => {
    expect(RECRUITER_SYSTEM_PROMPT).toContain("First identify the target job's primary domain");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("omit ORMs and vulnerability scanners for a contact-centre role");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("omit call-handling metrics for a software role");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("Keep every role from the master resume.");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("reframed around transferable skills");
  });

  it("mirrors job wording only for work the master resume shows", () => {
    expect(RECRUITER_SYSTEM_PROMPT).toContain(
      "Use the job description's own terminology when the master resume describes the same work.",
    );
    expect(RECRUITER_SYSTEM_PROMPT).toContain(
      "Never use job-description wording to add a frequency, method, scope, standard, metric, time of day, or framework the master resume does not state.",
    );
    expect(RECRUITER_SYSTEM_PROMPT).toContain('"handled escalations" becomes "point of escalation"');
    expect(RECRUITER_SYSTEM_PROMPT).toContain('"built REST endpoints" becomes "developed RESTful APIs"');
    expect(RECRUITER_SYSTEM_PROMPT).toContain('not "SMART monthly 1-1s"');
  });

  it("requires past-tense action verbs and closing periods", () => {
    expect(RECRUITER_SYSTEM_PROMPT).toContain(
      "Start every experience and project bullet with a strong, active, past-tense action verb",
    );
    expect(RECRUITER_SYSTEM_PROMPT).toContain("Responsible for, Helped with");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("end every bullet with a period.");
  });

  it("does not invent eligibility", () => {
    expect(RECRUITER_SYSTEM_PROMPT).toContain("Do not claim eligibility the master resume does not state");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("right to work");
  });

  it("asks for private strengths and gaps without a score", () => {
    expect(RECRUITER_SYSTEM_PROMPT).toContain("matchNote is a private note to the candidate.");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("matchNote.strengths names the top 2 or 3 areas");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("List eligibility first, such as work authorization, visas");
    expect(RECRUITER_SYSTEM_PROMPT).toContain("Do not give a score, percentage, rating, or keyword count.");
  });

  it("wraps inputs in master_resume and job_description tags", () => {
    const prompt = buildUserPrompt({ resume: " Supervisor. ", jobDescription: " Point of escalation. " });

    expect(prompt).toContain("<job_description>\nPoint of escalation.\n</job_description>");
    expect(prompt).toContain("<master_resume>\nSupervisor.\n</master_resume>");
    expect(prompt).toContain("Identify the job's primary domain");
    expect(prompt).toContain("Write matchNote.strengths and matchNote.gaps.");
  });
});

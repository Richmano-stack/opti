import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { OptimizedResume } from "@/features/tailoring/lib/types";

import { GuestWorkspaceHeader } from "./guest-workspace-header";
import { ResumePreviewCanvas, resumeToPlainText } from "./resume-preview-canvas";
import { readJobTarget, SourceSummaryCard } from "./source-summary-card";

const resume: OptimizedResume = {
  contact: {
    name: "Taylor Doe",
    email: "taylor@example.com",
    phone: undefined,
    location: undefined,
  },
  summary: "Product designer with SaaS experience.",
  skills: ["KPI Analysis", "Power Query", "Team Leadership"],
  experience: [
    {
      company: "Example Co",
      title: "Product Designer",
      dates: "2021-Present",
      bullets: ["Designed accessible product experiences."],
    },
  ],
  education: [{ institution: "Example University", degree: "BFA", dates: undefined }],
  matchNote: {
    strengths: "Team leadership and reporting.",
    gaps: "The résumé does not show right to work in the UK.",
  },
};

describe("guest workspace review layout", () => {
  it("reads a labeled job title and company from the posting", () => {
    expect(readJobTarget("Title: Contact Centre Supervisor\nCompany: MSC Cruises\n")).toEqual({
      title: "Contact Centre Supervisor",
      company: "MSC Cruises",
    });
    expect(readJobTarget("A role with no labels")).toEqual({
      title: "A role with no labels",
      company: "Company not listed",
    });
  });

  it("shows the target role and skill pills instead of the raw posting", () => {
    const html = renderToStaticMarkup(
      <SourceSummaryCard
        jobDescription={"Title: Contact Centre Supervisor\nCompany: MSC Cruises"}
        skills={resume.skills}
        matchNote={resume.matchNote}
        editing={false}
        onToggleEditing={() => undefined}
        isPending={false}
        onFill={() => undefined}
      >
        <p>Hidden source fields</p>
      </SourceSummaryCard>,
    );

    expect(html).toContain("Contact Centre Supervisor");
    expect(html).toContain("MSC Cruises");
    expect(html).toContain("Edit source inputs");
    expect(html).toContain("KPI Analysis");
    expect(html).toContain("Power Query");
    expect(html).toContain("Team Leadership");
    expect(html).toContain("Core strengths");
    expect(html).toContain("Potential gaps");
    expect(html).toContain("bg-slate-100");
    expect(html).toContain("hidden");
  });

  it("puts the role, draft status, and download on the workspace header", () => {
    const html = renderToStaticMarkup(
      <GuestWorkspaceHeader
        resume={resume}
        jobDescription={"Title: Contact Centre Supervisor\nCompany: MSC Cruises"}
        isPending={false}
        isReady
        headingRef={createRef<HTMLHeadingElement>()}
      />,
    );

    expect(html).toContain("Contact Centre Supervisor (MSC Cruises)");
    expect(html).toContain("Draft Ready");
    expect(html).toContain("Download PDF");
    expect(html).toContain("Refine with AI");
    expect(html).not.toContain("Why Opti");
  });

  it("keeps zoom, copy, and refine on a toolbar above the sheet", () => {
    const html = renderToStaticMarkup(
      <ResumePreviewCanvas resume={resume} isPending={false} isReady />,
    );

    expect(html).toContain("Copy text");
    expect(html).toContain("Refine with AI");
    expect(html).toContain("100%");
    expect(html).toContain("Taylor Doe");
    expect(html).toContain("shadow-md");
    expect(html).not.toContain("Download PDF");
    expect(html).not.toContain("Team leadership and reporting.");
  });

  it("copies the résumé sheet without the private match note", () => {
    const text = resumeToPlainText(resume);
    expect(text).toContain("Taylor Doe");
    expect(text).toContain("KPI Analysis · Power Query · Team Leadership");
    expect(text).not.toContain("right to work");
  });
});

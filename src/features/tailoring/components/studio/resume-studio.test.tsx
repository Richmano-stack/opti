import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { OptimizedResume } from "@/features/tailoring/lib/types";
import { ResumeStudio } from "./resume-studio";
import { ResumeStudioCanvas, resumeToPlainText } from "./resume-studio-canvas";
import { ResumeStudioHeader } from "./resume-studio-header";

vi.mock("@/features/tailoring/actions/generate-resume", () => ({
  submitGuestResume: vi.fn(),
}));

vi.mock("@/features/tailoring/actions/generate-account-resume", () => ({
  submitAccountResume: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/generator",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/server/auth/client", () => ({
  authClient: { signOut: vi.fn() },
}));

const mockResume: OptimizedResume = {
  contact: {
    name: "Taylor Doe",
    email: "taylor@example.com",
    phone: "555-0100",
    location: "London, UK",
  },
  summary: "Senior Full Stack Engineer with cloud architecture experience.",
  skills: ["TypeScript", "Next.js", "Tailwind CSS"],
  experience: [
    {
      company: "Acme Corp",
      title: "Senior Software Engineer",
      dates: "2022–Present",
      bullets: ["Architected accessible customer-facing applications."],
    },
  ],
  education: [
    { institution: "Tech University", degree: "BSc Computer Science", dates: "2018–2022" },
  ],
  matchNote: {
    strengths: "Full-stack web development and architecture.",
    gaps: "Job mentions GraphQL which is not explicitly listed.",
  },
};

describe("ResumeStudio", () => {
  it("renders the Canva-style studio workspace directly for guests", () => {
    const html = renderToStaticMarkup(<ResumeStudio mode="guest" />);

    expect(html).toContain('aria-label="Opti home"');
    expect(html).toContain("Master résumé");
    expect(html).toContain("Job description");
    expect(html).toContain("Tailor my résumé");
    expect(html).toContain("Nothing is saved after this session.");
    expect(html).toContain("Sign in");
    expect(html).not.toContain('aria-label="Sign out"');
    expect(html).toContain('aria-label="Résumé canvas"');
    expect(html).toContain("Your tailored résumé will appear here");
    expect(html).toContain("Strictly 1-page ATS formatted document");
    expect(html).toContain("Zoom");
    expect(html).toContain("100%");
  });

  it("renders the Canva-style studio workspace for authenticated users with saved master résumé", () => {
    const user = { id: "u-1", email: "test@example.com", name: "Test User" };
    const html = renderToStaticMarkup(
      <ResumeStudio mode="account" user={user} masterResumeUpdatedAt="14:30" />,
    );

    expect(html).toContain("Using your saved master résumé");
    expect(html).toContain("Last updated 14:30");
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain('name="jobDescription"');
    expect(html).not.toContain('name="resume"');
    expect(html).toContain("Job descriptions and generated résumés are not saved.");
    expect(html).toContain('aria-label="Résumé canvas"');
    expect(html).toContain("Strictly 1-page ATS formatted document");
    expect(html).toContain("Master résumé");
    expect(html).toContain('aria-label="Sign out"');
    expect(html).toContain("TU");
    expect(html).not.toContain("Workspace navigation");
    expect(html).not.toContain("Sign in");
  });

  it("renders completed tailored résumé with zoom toolbar on the paper canvas", () => {
    const html = renderToStaticMarkup(
      <ResumeStudioCanvas resume={mockResume} isPending={false} isReady={true} />,
    );

    expect(html).toContain("Taylor Doe");
    expect(html).toContain("Senior Full Stack Engineer");
    expect(html).toContain("Senior Software Engineer");
    expect(html).toContain("Acme Corp");
    expect(html).toContain("TypeScript · Next.js · Tailwind CSS");
    expect(html).toContain("Copy text");
    expect(html).toContain("Refine with AI");
    expect(html).toContain("100%");
  });

  it("exports formatted plain text from resumeToPlainText", () => {
    const text = resumeToPlainText(mockResume);

    expect(text).toContain("Taylor Doe");
    expect(text).toContain("Professional summary");
    expect(text).toContain("Senior Full Stack Engineer with cloud architecture experience.");
    expect(text).toContain("Experience");
    expect(text).toContain("Acme Corp");
    expect(text).toContain("• Architected accessible customer-facing applications.");
    expect(text).toContain("Skills\nTypeScript · Next.js · Tailwind CSS");
  });

  it("displays detected role and draft status on the studio header", () => {
    const ref = { current: null };
    const html = renderToStaticMarkup(
      <ResumeStudioHeader
        resume={mockResume}
        jobDescription={"Title: Staff Engineer\nCompany: Stripe\n"}
        isPending={false}
        isReady={true}
        headingRef={ref}
        mode="guest"
      />,
    );

    expect(html).toContain("Staff Engineer (Stripe)");
    expect(html).toContain("Draft Ready");
    expect(html).toContain("Download PDF");
    expect(html).toContain("Refine with AI");
  });

  it("renders segmented tabs for switching between Job description and Master résumé", () => {
    const html = renderToStaticMarkup(<ResumeStudio mode="guest" />);

    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-label="Source documents"');
    expect(html).toContain('role="tab"');
    expect(html).toContain("Job description");
    expect(html).toContain("Master résumé");
  });

  it("renders contact preflight with vertically stacked action buttons to prevent collision", async () => {
    const { ResumeStudioSidebar } = await import("./resume-studio-sidebar");
    const html = renderToStaticMarkup(
      <ResumeStudioSidebar
        mode="guest"
        resumeText="Taylor Doe"
        onResumeTextChange={() => undefined}
        jobDescription="Product Designer"
        onJobDescriptionChange={() => undefined}
        isPending={false}
        isReady={true}
        missingFields={["linkedin", "portfolio"]}
        editingSources={false}
        onToggleEditingSources={() => undefined}
        onFillSample={() => undefined}
      />,
    );

    expect(html).toContain("Complete your contact details");
    expect(html).toContain("LinkedIn profile");
    expect(html).toContain("Portfolio website");
    expect(html).toContain("Add details and continue");
    expect(html).toContain("Continue without them");
    expect(html).toContain("flex flex-col gap-2");
    expect(html).not.toContain("sm:grid-cols-2");
  });
});

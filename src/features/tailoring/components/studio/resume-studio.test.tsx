import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { OptimizedResume } from "@/features/tailoring/lib/types";
import { ResumeStudio } from "./resume-studio";
import { ResumeStudioCanvas } from "./resume-studio-canvas";
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
    expect(html).toContain("ATS-friendly Letter layout");
    expect(html).toContain("Zoom");
    expect(html).toContain("100%");
    expect(html).toContain("Fit width");
    expect(html).not.toContain('aria-label="Template"');
    expect(html).not.toContain("Copy text");
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
    expect(html).toContain("ATS-friendly Letter layout");
    expect(html).toContain("Master résumé");
    expect(html).toContain('data-slot="sidebar-wrapper"');
    expect(html).not.toContain("Sign in");
  });

  it("keeps one header with the role, the download on the canvas, and one Tailor button inside the form", () => {
    const user = { id: "u-1", email: "test@example.com", name: "Test User" };
    const html = renderToStaticMarkup(<ResumeStudio mode="account" user={user} />);

    const header = html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
    expect(html.match(/<header/g)).toHaveLength(1);
    expect(header).toContain('id="studio-target-heading"');
    expect(header).toContain("New tailored résumé");
    expect(header).not.toContain("Download PDF");
    expect(header).not.toContain("Tailor my résumé");

    const canvas = html.match(/<section[^>]*aria-label="Résumé canvas"[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(canvas).toContain('aria-label="Download PDF"');

    const form = html.match(/<form[\s\S]*<\/form>/)?.[0] ?? "";
    expect(html.match(/Tailor my résumé/g)).toHaveLength(1);
    expect(form).toMatch(/<button[^>]*type="submit"[^>]*>[\s\S]*?Tailor my résumé/);
    expect(html).not.toContain("Tailor with AI");
  });

  it("disables the Match tab until a tailored résumé exists", () => {
    const user = { id: "u-1", email: "test@example.com", name: "Test User" };
    const html = renderToStaticMarkup(<ResumeStudio mode="account" user={user} />);

    expect(html).toContain('aria-label="Studio panels"');
    expect(html).toMatch(/<button[^>]*role="tab"[^>]*(aria-disabled="true"|disabled="")[^>]*>Match<|<button[^>]*(aria-disabled="true"|disabled="")[^>]*role="tab"[^>]*>Match</);
    expect(html).toContain("Using your saved master résumé");
  });

  it("renders completed tailored résumé with zoom toolbar on the paper canvas", () => {
    const html = renderToStaticMarkup(
      <ResumeStudioCanvas resume={mockResume} isPending={false} templateId="minimal" />,
    );

    expect(html).toContain("Taylor Doe");
    expect(html).toContain("Senior Full Stack Engineer");
    expect(html).toContain("Senior Software Engineer");
    expect(html).toContain("Acme Corp");
    expect(html).toContain("TypeScript, Next.js, Tailwind CSS");
    expect(html).not.toContain("Refine with AI");
    expect(html).toContain("100%");
  });

  it("displays the detected role on the guest studio header without the download", () => {
    const ref = { current: null };
    const html = renderToStaticMarkup(
      <ResumeStudioHeader jobDescription={"Title: Staff Engineer\nCompany: Stripe\n"} headingRef={ref} />,
    );

    expect(html).toContain("Staff Engineer (Stripe)");
    expect(html).not.toContain("Download PDF");
    expect(html).not.toContain("Refine with AI");
  });

  it("puts the guest download on the canvas", () => {
    const html = renderToStaticMarkup(<ResumeStudio mode="guest" />);

    const header = html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
    const canvas = html.match(/<section[^>]*aria-label="Résumé canvas"[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(header).not.toContain("Download PDF");
    expect(canvas).toContain('aria-label="Download PDF"');
  });

  it("renders Job, Résumé and Match tabs for guests with both inputs kept in the form", () => {
    const html = renderToStaticMarkup(<ResumeStudio mode="guest" />);

    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-label="Studio panels"');
    expect(html).toContain(">Job<");
    expect(html).toContain(">Résumé<");
    expect(html).toContain(">Match<");
    expect(html).toContain('name="jobDescription"');
    expect(html).toContain('name="resume"');
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

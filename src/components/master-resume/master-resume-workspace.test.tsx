import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/server/auth/client", () => ({
  authClient: { signOut: vi.fn() },
}));

vi.mock("@/app/actions/master-resume", () => ({
  saveMasterResume: vi.fn(),
}));

import { MasterResumeWorkspace } from "./master-resume-workspace";

const mockUser = {
  id: "user-123",
  email: "alex@example.com",
  name: "Alex Smith",
};

describe("MasterResumeWorkspace", () => {
  it("renders first-time setup state when no resume content exists", () => {
    const html = renderToStaticMarkup(
      <MasterResumeWorkspace user={mockUser} initialContent="" />,
    );

    expect(html).toContain("Set up your source resume");
    expect(html).toContain("Your factual source of truth");
    expect(html).toContain("Save master resume");
    expect(html).toContain("Save it once. Update it whenever your experience changes.");
    expect(html).toContain("Generated resumes, job descriptions, and PDFs are not stored.");
    expect(html).not.toContain('href="/dashboard/generator"');
    expect(html).toContain("0 / 50,000 characters");
  });

  it("renders existing master resume view with content and tailor CTA", () => {
    const content = "5+ years of software engineering experience.";
    const html = renderToStaticMarkup(
      <MasterResumeWorkspace
        user={mockUser}
        initialContent={content}
        initialUpdatedAt="10:30 AM"
      />,
    );

    expect(html).toContain("Source resume ready");
    expect(html).toContain("Your master resume");
    expect(html).toContain("Continue to tailoring");
    expect(html).toContain('href="/dashboard/generator"');
    expect(html).toContain("Save changes");
    expect(html).toContain("Last saved at 10:30 AM");
    expect(html).toContain("Generated resumes, job descriptions, and PDFs are not stored.");
    expect(html).toContain(content);
  });
});

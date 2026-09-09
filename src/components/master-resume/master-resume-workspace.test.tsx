import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/dashboard",
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
    expect(html).toContain("Save master resume");
    expect(html).toContain("Generated resumes, job descriptions, and PDFs are not stored.");
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

    expect(html).toContain("Your source document");
    expect(html).toContain("Continue to tailoring");
    expect(html).toContain('href="/dashboard/generator"');
    expect(html).toContain("Save changes");
    expect(html).toContain("Last saved at 10:30 AM");
    expect(html).toContain("Generated resumes, job descriptions, and PDFs are not stored.");
    expect(html).toContain(content);
  });

  it("presents the resume editor as the primary workspace beneath the app header", () => {
    const html = renderToStaticMarkup(
      <MasterResumeWorkspace
        user={mockUser}
        initialContent="Product designer with seven years of experience."
        initialUpdatedAt="10:30 AM"
      />,
    );

    const editorPosition = html.indexOf('aria-labelledby="editor-title"');
    const toolbarPosition = html.indexOf('aria-label="Document toolbar"');
    const savePosition = html.indexOf("Save changes");
    const textAreaPosition = html.indexOf("<textarea");

    expect(html).not.toContain('id="dashboard-title"');
    expect(html).toContain('aria-label="Document canvas"');
    expect(html).toContain('aria-label="Resume next step"');
    expect(toolbarPosition).toBeGreaterThan(editorPosition);
    expect(savePosition).toBeGreaterThan(toolbarPosition);
    expect(textAreaPosition).toBeGreaterThan(savePosition);
  });
});


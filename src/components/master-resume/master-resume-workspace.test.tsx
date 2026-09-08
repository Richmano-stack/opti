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
  it("renders setup as an intentional entry point instead of an exposed editor", () => {
    const html = renderToStaticMarkup(
      <MasterResumeWorkspace user={mockUser} initialContent="" />,
    );

    expect(html).toContain("Set up your master résumé");
    expect(html).toContain("Add master résumé");
    expect(html).toContain("Only your master résumé is saved.");
    expect(html).not.toContain("master-resume-editor");
  });

  it("renders a compact saved overview with tailoring primary and content hidden", () => {
    const content = "5+ years of software engineering experience.";
    const html = renderToStaticMarkup(
      <MasterResumeWorkspace
        user={mockUser}
        initialContent={content}
        initialUpdatedAt="10:30 AM"
      />,
    );

    expect(html).toContain("Your master résumé");
    expect(html).toContain("Tailor for a role");
    expect(html).toContain("Create a focused version without changing your source.");
    expect(html).toContain('href="/dashboard/generator"');
    expect(html).toContain("Edit master résumé");
    expect(html).toContain("Updated 10:30 AM");
    expect(html).toContain("44 characters");
    expect(html).toContain("Only your master résumé is saved.");
    expect(html).not.toContain(content);
    expect(html).not.toContain("master-resume-editor");
  });
});


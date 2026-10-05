import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/dashboard",
}));

vi.mock("@/server/auth/client", () => ({
  authClient: { signOut: vi.fn() },
}));

vi.mock("@/features/master-resume/actions/save-master-resume", () => ({
  saveMasterResume: vi.fn(),
}));

import { MasterResumeWorkspace } from "./master-resume-workspace";

const mockUser = {
  id: "user-123",
  email: "alex@example.com",
  name: "Alex Smith",
};

describe("MasterResumeWorkspace", () => {
  it("hides the editor until a first résumé is added", () => {
    const html = renderToStaticMarkup(
      <MasterResumeWorkspace user={mockUser} initialContent="" />,
    );

    expect(html).toContain("Add master résumé");
    expect(html).toContain("Not saved");
    expect(html).toContain("0 / 50,000 characters");
    expect(html).toContain("Save one source résumé");
    expect(html).not.toContain("Tailor for a role");
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain('role="dialog"');
    expect(html).not.toContain("Fill sample");
  });

  it("shows a saved overview with tailoring primary and editing secondary", () => {
    const content = "5+ years of software engineering experience.";
    const html = renderToStaticMarkup(
      <MasterResumeWorkspace
        user={mockUser}
        initialContent={content}
        initialUpdatedAt="10:30 AM"
      />,
    );

    const tailorPosition = html.indexOf("Tailor for a role");
    const editPosition = html.indexOf("Edit master résumé");

    expect(html).toContain('href="/dashboard/generator"');
    expect(html).toContain("Saved · Last saved at 10:30 AM");
    expect(html).not.toContain("Not saved");
    expect(html).toContain("Last saved at 10:30 AM");
    expect(html).toContain(`${content.length} / 50,000 characters`);
    expect(html).toContain('aria-label="Document preview"');
    expect(tailorPosition).toBeGreaterThan(-1);
    expect(editPosition).toBeGreaterThan(tailorPosition);
    expect(html).not.toContain(content);
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain('role="dialog"');
  });
});

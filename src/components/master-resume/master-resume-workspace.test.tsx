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

    expect(html).toContain("First-time setup");
    expect(html).toContain("Save your master resume");
    expect(html).toContain("Save master resume");
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

    expect(html).toContain("Master resume active");
    expect(html).toContain("Your Master Resume");
    expect(html).toContain("Tailor for a role");
    expect(html).toContain("Save changes");
    expect(html).toContain(content);
  });
});

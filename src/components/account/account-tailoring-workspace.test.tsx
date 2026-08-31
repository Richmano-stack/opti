import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/generate-account-resume", () => ({
  submitAccountResume: vi.fn(),
}));

import { AccountGeneratorSetupRequired } from "./account-generator-setup-required";
import { AccountTailoringWorkspace } from "./account-tailoring-workspace";

const user = {
  id: "user-123",
  email: "alex@example.com",
  name: "Alex Smith",
};

describe("AccountTailoringWorkspace", () => {
  it("asks only for the job description", () => {
    const html = renderToStaticMarkup(
      <AccountTailoringWorkspace user={user} masterResumeUpdatedAt="10:30 AM" />,
    );

    expect(html).toContain("Tailor your saved résumé");
    expect(html).toContain("Using your saved master résumé");
    expect(html).toContain("Last updated 10:30 AM");
    expect(html).toContain('name="jobDescription"');
    expect(html).toContain('placeholder="Paste the full job description here"');
    expect(html).not.toContain('name="resume"');
    expect(html).toContain("Your tailored résumé will appear here");
  });

  it("guides users without a master resume back to setup", () => {
    const html = renderToStaticMarkup(<AccountGeneratorSetupRequired user={user} />);

    expect(html).toContain("Save your master résumé first");
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain("Go to master résumé");
  });
});
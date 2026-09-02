import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/generate-account-resume", () => ({
  submitAccountResume: vi.fn(),
}));

import { AccountGeneratorSetupRequired } from "./account-generator-setup-required";
import {
  AccountGeneratorReview,
  AccountTailoringWorkspace,
  ErrorNotice,
  GeneratorSubmitContent,
} from "./account-tailoring-workspace";

const user = {
  id: "user-123",
  email: "alex@example.com",
  name: "Alex Smith",
};

describe("AccountTailoringWorkspace", () => {
  it("presents a focused job-description composer without an empty result panel", () => {
    const html = renderToStaticMarkup(
      <AccountTailoringWorkspace user={user} masterResumeUpdatedAt="10:30 AM" />,
    );

    expect(html).toContain("Start with the role");
    expect(html).toContain("Using your saved master résumé");
    expect(html).toContain("Last updated 10:30 AM");
    expect(html).toContain('name="jobDescription"');
    expect(html).toContain('placeholder="Paste the full job description here"');
    expect(html).not.toContain('name="resume"');
    expect(html).toContain("Job descriptions and generated résumés are not saved");
    expect(html).not.toContain("Your tailored résumé will appear here");
  });

  it("guides users without a master resume back to setup", () => {
    const html = renderToStaticMarkup(<AccountGeneratorSetupRequired user={user} />);

    expect(html).toContain("Your source comes first");
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain("Go to master résumé");
  });

  it("communicates loading and provider failures accessibly", () => {
    const loading = renderToStaticMarkup(<GeneratorSubmitContent isPending />);
    const error = renderToStaticMarkup(<ErrorNotice message="The provider is unavailable." />);

    expect(loading).toContain("Tailoring your résumé…");
    expect(error).toContain('role="alert"');
    expect(error).toContain("The provider is unavailable.");
  });

  it("makes the generated document the primary review surface", () => {
    const resume = {
      contact: { name: "Alex Smith", email: "alex@example.com", phone: undefined, location: undefined },
      summary: "Product designer focused on accessible financial tools.",
      skills: ["Research", "Prototyping"],
      experience: [{ company: "Example", title: "Designer", dates: "2022–Present", bullets: ["Designed accessible payment journeys."] }],
      education: [{ institution: "Example University", degree: "BSc", dates: undefined }],
    };
    const resultHeading = { current: null };
    const html = renderToStaticMarkup(
      <AccountGeneratorReview resume={resume} resultHeading={resultHeading} jobDescription="Senior product designer" />,
    );

    expect(html).toContain("Ready to review");
    expect(html).toContain("Alex Smith");
    expect(html).toContain("Download PDF");
    expect(html).toContain("Tailor another");
  });
});


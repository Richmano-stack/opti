import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AuthPageShell } from "./auth-page-shell";

describe("AuthPageShell", () => {
  it("keeps returning-user navigation concise and truthful", () => {
    const html = renderToStaticMarkup(
      <AuthPageShell variant="login">
        <div>Login form</div>
      </AuthPageShell>,
    );

    expect(html).toContain("Your master resume, ready when you are.");
    expect(html).toContain('href="/try"');
    expect(html).toContain("Guest work isn’t saved");
    expect(html).not.toContain("PDFs are saved");
  });

  it("explains the account benefit without claiming generated work is saved", () => {
    const html = renderToStaticMarkup(
      <AuthPageShell variant="signup">
        <div>Signup form</div>
      </AuthPageShell>,
    );

    expect(html).toContain("Save one master resume.");
    expect(html).toContain("Return to it whenever you’re ready to tailor again");
    expect(html).toContain('href="/try"');
    expect(html).not.toContain("generated resumes are saved");
    expect(html).not.toContain("job descriptions are saved");
    expect(html).not.toContain("PDFs are saved");
  });
});

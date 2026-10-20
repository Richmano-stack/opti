import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/server/auth/client", () => ({
  authClient: { requestPasswordReset: vi.fn(), resetPassword: vi.fn() },
}));

import { ForgotPasswordForm } from "./forgot-password-form";
import { ResetPasswordForm } from "./reset-password-form";

describe("password recovery forms", () => {
  it("renders the forgot-password request with shadcn fields and a way back to sign in", () => {
    const html = renderToStaticMarkup(<ForgotPasswordForm />);

    expect(html).toContain("Forgot your password?");
    expect(html).toContain('data-slot="card"');
    expect(html).toContain('data-slot="field-label"');
    expect(html).toMatch(/<input[^>]*type="email"/);
    expect(html).toContain("Send reset link");
    expect(html).toContain('href="/login"');
  });

  it("asks for a new password when the reset link carries a token", () => {
    const html = renderToStaticMarkup(<ResetPasswordForm token="abc" error={null} />);

    expect(html).toContain("Choose a new password");
    expect(html).toContain('for="password"');
    expect(html).toContain('for="confirm-password"');
    expect(html).toContain("Save password");
    expect(html).not.toContain("This link is no longer valid");
  });

  it("sends people to request a new link when the token is missing or invalid", () => {
    for (const props of [{ token: null, error: null }, { token: "abc", error: "INVALID_TOKEN" }]) {
      const html = renderToStaticMarkup(<ResetPasswordForm {...props} />);

      expect(html).toContain("This link is no longer valid");
      expect(html).toContain('href="/forgot-password"');
      expect(html).not.toContain("Save password");
    }
  });
});

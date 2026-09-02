import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const { getServerSession, redirect } = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({ getServerSession }));
vi.mock("next/navigation", () => ({ redirect }));

import AuthLayout from "./layout";

describe("AuthLayout", () => {
  it("renders auth pages when no valid session exists", async () => {
    getServerSession.mockResolvedValue(null);

    const result = await AuthLayout({ children: <div>Log in</div> });

    const html = renderToStaticMarkup(result);

    expect(html).toContain('aria-label="Opti home"');
    expect(html).toContain('href="/"');
    expect(html).toContain("Log in");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects a valid authenticated session to the dashboard", async () => {
    getServerSession.mockResolvedValue({
      user: { id: "user-1", email: "demo@opti.local", name: "Opti Demo" },
    });

    await AuthLayout({ children: <div>Log in</div> });

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});

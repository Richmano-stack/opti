import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/templates",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/server/auth/client", () => ({
  authClient: { signOut: vi.fn() },
}));

import { TemplatesComingSoon } from "./templates-coming-soon";

describe("TemplatesComingSoon", () => {
  it("shows a coming-soon notice instead of the gallery and points to the studio", () => {
    const html = renderToStaticMarkup(
      <TemplatesComingSoon user={{ id: "u-1", email: "alex@example.com", name: "Alex Smith" }} />,
    );

    expect(html).toContain("Templates are coming soon");
    expect(html).toMatch(/href="\/dashboard\/generator"[^>]*>Tailor a résumé/);
    expect(html).toContain('data-slot="sidebar-wrapper"');
    expect(html).not.toContain("Use this template");
    expect(html).not.toContain("<img");
  });
});

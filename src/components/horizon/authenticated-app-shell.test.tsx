import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard", useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/server/auth/client", () => ({ authClient: { signOut: vi.fn() } }));

import { AuthenticatedAppShell } from "./authenticated-app-shell";

describe("AuthenticatedAppShell", () => {
  it("provides desktop and mobile workspace navigation", () => {
    const html = renderToStaticMarkup(<AuthenticatedAppShell title="Master résumé" user={{ id: "u1", email: "a@example.com", name: "Alex" }}><p>Workspace</p></AuthenticatedAppShell>);
    expect(html).toContain("Mobile workspace navigation");
    expect(html).toContain("Workspace navigation");
    expect(html).toContain("Tailor");
    expect(html).toContain('aria-label="Desktop workspace sidebar"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("lg:h-dvh");
    expect(html).toContain("lg:overflow-y-auto");
  });

  it("places an optional workspace utility above desktop sign out", () => {
    const html = renderToStaticMarkup(
      <AuthenticatedAppShell
        title="Master résumé"
        user={{ id: "u1", email: "a@example.com", name: "Alex" }}
        sidebarUtility={<aside aria-label="Resume next step">Ready for a role?</aside>}
      >
        <p>Workspace</p>
      </AuthenticatedAppShell>,
    );

    expect(html.indexOf('aria-label="Resume next step"')).toBeGreaterThan(
      html.indexOf('aria-label="Desktop workspace sidebar"'),
    );
    expect(html.indexOf("Sign out")).toBeGreaterThan(
      html.indexOf('aria-label="Resume next step"'),
    );
  });
});

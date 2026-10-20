import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard", useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/server/auth/client", () => ({ authClient: { signOut: vi.fn() } }));

import { AuthenticatedAppShell } from "./authenticated-app-shell";
import { SidebarOpenStateProvider } from "./sidebar-open-state";

describe("AuthenticatedAppShell", () => {
  it("wraps page content in the sidebar-07 shell with Opti navigation and the signed-in user", () => {
    const html = renderToStaticMarkup(
      <AuthenticatedAppShell
        title="Master résumé"
        user={{ id: "u1", email: "a@example.com", name: "Alex Rivera" }}
        actions={<a href="/dashboard/templates">Tailor for a role</a>}
      >
        <p>Workspace</p>
      </AuthenticatedAppShell>,
    );

    expect(html).toContain('data-slot="sidebar-wrapper"');
    expect(html).toContain('data-slot="sidebar-inset"');
    expect(html).toContain("Toggle Sidebar");
    expect(html).toContain('href="/dashboard/templates"');
    expect(html).toContain('href="/dashboard/generator"');
    expect(html).toMatch(/<a(?=[^>]*href="\/dashboard")(?=[^>]*aria-current="page")[^>]*>/);
    expect(html).not.toMatch(/<a(?=[^>]*href="\/dashboard\/(templates|generator)")(?=[^>]*aria-current="page")[^>]*>/);
    expect(html).toContain("Templates");
    expect(html).toContain("Master résumé");
    expect(html).toContain("Tailor");
    expect(html).toContain("Alex Rivera");
    expect(html).toContain("a@example.com");
    expect(html).toContain(">AR<");
    expect(html).not.toContain("Acme Inc");
    expect(html).not.toContain("Build Your Application");
    expect(html).not.toContain("Data Fetching");
    expect(html).toMatch(/data-slot="breadcrumb-link"[^>]*href="\/dashboard\/generator"[^>]*>Opti<|href="\/dashboard\/generator"[^>]*data-slot="breadcrumb-link"[^>]*>Opti</);
    expect(html).toMatch(/data-slot="breadcrumb-page"[^>]*>Master résumé</);
    expect(html).toContain("Tailor for a role");
    expect(html).toContain("<p>Workspace</p>");
  });

  it("keeps the sidebar collapsed when the dashboard layout says it was collapsed", () => {
    const html = renderToStaticMarkup(
      <SidebarOpenStateProvider initialOpen={false}>
        <AuthenticatedAppShell title="Tailor" user={{ id: "u1", email: "a@example.com", name: "Alex Rivera" }}>
          <p>Workspace</p>
        </AuthenticatedAppShell>
      </SidebarOpenStateProvider>,
    );

    expect(html).toContain('data-state="collapsed"');
    expect(html).not.toContain('data-state="expanded"');
  });
});

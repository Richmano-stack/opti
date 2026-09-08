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
  });
});

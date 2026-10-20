import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/dashboard/templates",
}));

vi.mock("@/server/auth/client", () => ({
  authClient: { signOut: vi.fn() },
}));

import { TemplateGallery } from "./template-gallery";

describe("TemplateGallery", () => {
  it("opens a template from the store and keeps account navigation visible", () => {
    const html = renderToStaticMarkup(
      <TemplateGallery user={{ id: "u-1", email: "alex@example.com", name: "Alex Smith" }} />,
    );

    expect(html).toContain("Choose a template");
    expect(html).toContain("Browse the layouts");
    expect(html).toContain("Modern");
    expect(html).toContain("Minimal");
    expect(html).toContain('data-slot="sidebar-wrapper"');
    expect(html).toContain('src="/templates/modern.svg"');
    expect(html).toContain('src="/templates/minimal.svg"');
    expect(html).toContain('href="/dashboard/generator?template=minimal"');
    expect(html).toContain('href="/dashboard/generator?template=modern"');
    expect(html).toContain("Use this template");
    expect(html).not.toContain(">Continue<");
  });
});

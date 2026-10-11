import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/generator",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/server/auth/client", () => ({
  authClient: { signOut: vi.fn() },
}));

import { AccountGeneratorSetupRequired } from "./account-generator-setup-required";

describe("AccountGeneratorSetupRequired", () => {
  it("guides users without a master resume back to setup", () => {
    const html = renderToStaticMarkup(
      <AccountGeneratorSetupRequired
        user={{ id: "user-123", email: "alex@example.com", name: "Alex Smith" }}
      />,
    );

    expect(html).toContain("Your source comes first");
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain("Go to master résumé");
    expect(html).toContain('aria-label="Sign out"');
    expect(html).not.toContain("Workspace navigation");
  });
});

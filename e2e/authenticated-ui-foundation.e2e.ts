import { randomUUID } from "node:crypto";

import { expect, test } from "@playwright/test";
import postgres from "postgres";

import { signUpAndSignIn } from "./support/auth";
import { cleanupPreservingTestFailure } from "./support/cleanup";
import { collectBrowserErrors, expectNoHorizontalOverflow } from "./support/ui-verification";

const connectionString = process.env.DATABASE_URL;

const viewports = [
  { name: "mobile", viewport: { width: 375, height: 812 } },
  { name: "desktop", viewport: { width: 1440, height: 960 } },
] as const;

for (const { name, viewport } of viewports) {
  test(`authenticated shell has no horizontal overflow at ${name} viewport`, async ({ page }) => {
    test.skip(!connectionString, "DATABASE_URL is required for authenticated UI checks");
    await page.setViewportSize(viewport);

    const id = randomUUID();
    const email = `opti-ui-${id}@example.test`;
    const password = `UiCheck-${id}!`;
    const sql = postgres(connectionString!, { prepare: false });
    const browserErrors = collectBrowserErrors(page);

    let testFailure: unknown;
    try {
      await signUpAndSignIn(page, email, password, async (testEmail) => {
        await sql`update users set email_verified = true where email = ${testEmail}`;
      });
      if (name === "mobile") {
        await expect(page.locator('[data-slot="sidebar-trigger"]')).toBeVisible();
      } else {
        const sidebar = page.locator('[data-slot="sidebar"]');
        await expect(sidebar).toBeVisible();
        await expect(sidebar.getByRole("link", { name: "Master résumé" })).toBeVisible();
      }
      await expectNoHorizontalOverflow(page);
      expect(browserErrors.errors).toEqual([]);
    } catch (error: unknown) {
      testFailure = error;
      throw error;
    } finally {
      await cleanupPreservingTestFailure(
        async () => {
          await sql`delete from verification where identifier = ${email}`;
          await sql`delete from users where email = ${email}`;
        },
        () => sql.end(),
        testFailure,
      );
    }
  });
}

import { randomUUID } from "node:crypto";

import { expect, test } from "@playwright/test";
import postgres from "postgres";

import { collectBrowserErrors, expectNoHorizontalOverflow } from "./support/ui-verification";

const connectionString = process.env.DATABASE_URL;

const viewports = [
  { name: "mobile", viewport: { width: 375, height: 812 }, navigation: "Mobile workspace navigation" },
  { name: "desktop", viewport: { width: 1440, height: 960 }, navigation: "Workspace navigation" },
] as const;

for (const { name, viewport, navigation } of viewports) {
  test(`authenticated shell has no horizontal overflow at ${name} viewport`, async ({ page }) => {
    test.skip(!connectionString, "DATABASE_URL is required for authenticated UI checks");
    await page.setViewportSize(viewport);

    const id = randomUUID();
    const email = `opti-ui-${id}@example.test`;
    const password = `UiCheck-${id}!`;
    const sql = postgres(connectionString!, { prepare: false });
    const browserErrors = collectBrowserErrors(page);

    try {
      await page.goto("/signup");
      await page.getByLabel("Full name").fill("UI Check User");
      await page.getByLabel("Email address").fill(email);
      await page.getByLabel("Password", { exact: true }).fill(password);
      await page.getByLabel("Confirm password").fill(password);
      await page.getByRole("button", { name: "Create Account" }).click();

      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(page.getByRole("navigation", { name: navigation })).toBeVisible();
      await expectNoHorizontalOverflow(page);
      expect(browserErrors.errors).toEqual([]);
    } finally {
      await sql`delete from users where email = ${email}`;
      await sql.end();
    }
  });
}

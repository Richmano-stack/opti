import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import postgres from "postgres";

import { signUpAndSignIn } from "./support/auth";
import { cleanupPreservingTestFailure } from "./support/cleanup";

test("authenticated users follow the protected lifecycle", async ({ page }) => {
  const connectionString = process.env.DATABASE_URL;
  test.skip(!connectionString, "DATABASE_URL is required for authenticated lifecycle tests");
  const id = randomUUID();
  const email = `opti-lifecycle-${id}@example.test`;
  const password = `Lifecycle-${id}!`;
  const sql = postgres(connectionString!, { prepare: false });

  let testFailure: unknown;
  try {
    await signUpAndSignIn(page, email, password, async (testEmail) => {
      await sql`update users set email_verified = true where email = ${testEmail}`;
    });

    await page.goto("/dashboard/templates");
    await expect(page).toHaveURL(/\/dashboard\/templates$/);
    await expect(page.getByRole("heading", { name: "Templates are coming soon" })).toBeVisible();
    await expect(page.locator('[data-slot="sidebar"]').getByRole("link", { name: "Templates", exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Account", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard#account$/);
    await expect(page.locator("#account")).toBeVisible();
    await page.getByRole("link", { name: "Privacy boundary", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard#privacy$/);
    await expect(page.locator("#privacy")).toBeVisible();

    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard\/generator$/);
    await page.goto("/signup");
    await expect(page).toHaveURL(/\/dashboard\/generator$/);

    await page.goto("/dashboard/generator");
    await page.getByRole("button", { name: new RegExp(email) }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard$/);
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


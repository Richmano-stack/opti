import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import postgres from "postgres";

test("authenticated users follow the protected lifecycle", async ({ page }) => {
  const connectionString = process.env.DATABASE_URL;
  test.skip(!connectionString, "DATABASE_URL is required for authenticated lifecycle tests");
  const id = randomUUID();
  const email = `opti-lifecycle-${id}@example.test`;
  const password = `Lifecycle-${id}!`;
  const sql = postgres(connectionString!, { prepare: false });

  try {
    await page.goto("/signup");
    await page.getByLabel("Full name").fill("Lifecycle User");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/");
    await expect(page.getByRole("link", { name: "Open dashboard" })).toBeVisible();
    await page.getByRole("link", { name: "Open dashboard" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto("/signup");
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/dashboard/generator");
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard$/);
  } finally {
    await sql`delete from users where email = ${email}`;
    await sql.end();
  }
});


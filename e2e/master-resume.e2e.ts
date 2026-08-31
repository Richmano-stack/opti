import { randomUUID } from "node:crypto";

import { expect, test } from "@playwright/test";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

test("an account user can create, reload, and edit a master resume", async ({ page }) => {
  test.skip(!connectionString, "DATABASE_URL is required for account E2E tests");

  const testId = randomUUID();
  const email = `opti-e2e-${testId}@example.test`;
  const password = `LocalTest-${testId}!`;
  const sql = postgres(connectionString!, { prepare: false });
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  try {
    await page.goto("/signup");
    await page.getByLabel("Full name").fill("Opti E2E User");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText("First-time setup")).toBeVisible();

    const editor = page.getByLabel("Full, unedited career experience");
    await editor.fill("E2E first resume version");
    await page.getByRole("button", { name: "Save master resume" }).click();
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();

    await page.reload();
    await expect(editor).toHaveValue("E2E first resume version");
    await expect(page.getByText("Master resume active")).toBeVisible();

    await editor.fill("E2E updated resume version");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();

    await page.reload();
    await expect(editor).toHaveValue("E2E updated resume version");
    expect(browserErrors).toEqual([]);
  } finally {
    await sql`delete from users where email = ${email}`;
    await sql.end();
  }
});
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
    await expect(page.getByRole("button", { name: "Add master résumé" })).toBeVisible();
    await expect(page.getByLabel("Full, unedited career experience")).toHaveCount(0);

    await page.getByRole("button", { name: "Add master résumé" }).click();
    const editor = page.getByLabel("Full, unedited career experience");
    const dialog = page.getByRole("dialog", { name: "Add master résumé" });
    await expect(dialog).toBeVisible();
    await editor.fill("E2E first resume version");
    await page.getByRole("button", { name: "Save master resume" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText("Your master résumé is saved.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Tailor for a role" })).toBeVisible();

    await page.reload();
    await expect(page.getByText("E2E first resume version")).toHaveCount(0);
    await expect(page.getByText("Last saved at")).toBeVisible();

    await page.getByRole("button", { name: "Edit master résumé" }).click();
    await expect(editor).toHaveValue("E2E first resume version");
    await editor.fill("E2E discarded resume version");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("button", { name: "Edit master résumé" })).toBeFocused();

    await page.getByRole("button", { name: "Edit master résumé" }).click();
    await expect(editor).toHaveValue("E2E first resume version");
    await editor.fill("");
    await expect(page.getByRole("button", { name: "Save changes" })).toBeDisabled();
    await editor.fill("E2E updated resume version");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Your master résumé is saved.")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Edit master résumé" }).click();
    await expect(editor).toHaveValue("E2E updated resume version");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Edit master résumé" })).toBeFocused();
    expect(browserErrors).toEqual([]);
  } finally {
    await sql`delete from users where email = ${email}`;
    await sql.end();
  }
});
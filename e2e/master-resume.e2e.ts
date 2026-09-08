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
    await expect(page.getByRole("heading", { name: "Set up your master résumé" })).toBeVisible();
    await expect(page.getByLabel("Full, unedited career experience")).toHaveCount(0);

    const addTrigger = page.getByRole("button", { name: "Add master résumé" });
    await addTrigger.click();
    const dialog = page.getByRole("dialog", { name: "Add your master résumé" });
    await expect(dialog).toBeVisible();
    const editor = dialog.getByLabel("Full, unedited career experience");
    await editor.fill("E2E first resume version");
    await dialog.getByRole("button", { name: "Save changes" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText("Changes saved", { exact: true })).toBeVisible();

    await page.reload();
    await expect(page.getByLabel("Full, unedited career experience")).toHaveCount(0);
    await expect(page.getByText("E2E first resume version")).toHaveCount(0);

    const editTrigger = page.getByRole("button", { name: "Edit master résumé" });
    await editTrigger.click();
    const editDialog = page.getByRole("dialog", { name: "Edit master résumé" });
    const editEditor = editDialog.getByLabel("Full, unedited career experience");
    await expect(editEditor).toHaveValue("E2E first resume version");
    await editEditor.fill("Unsaved resume version");
    await editDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(editDialog).toHaveCount(0);
    await expect(editTrigger).toBeFocused();

    await editTrigger.click();
    const saveDialog = page.getByRole("dialog", { name: "Edit master résumé" });
    await saveDialog.getByLabel("Full, unedited career experience").fill("E2E updated resume version");
    await saveDialog.getByRole("button", { name: "Save changes" }).click();
    await expect(saveDialog).toHaveCount(0);

    await page.reload();
    await page.getByRole("button", { name: "Edit master résumé" }).click();
    await expect(page.getByRole("dialog", { name: "Edit master résumé" }).getByLabel("Full, unedited career experience")).toHaveValue("E2E updated resume version");
    expect(browserErrors).toEqual([]);
  } finally {
    await sql`delete from users where email = ${email}`;
    await sql.end();
  }
});

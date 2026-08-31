import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
const providerConfigured = Boolean(process.env.OPENROUTER_API_KEY);
const syntheticResume = `Alex Example
alex@example.invalid | Example City

SUMMARY
Frontend engineer with four years of experience building accessible web interfaces.

SKILLS
TypeScript, React, Node.js, REST APIs, PostgreSQL, automated testing

EXPERIENCE
Example Software Company — Frontend Engineer
2022 – Present
- Built accessible React interfaces for an internal operations dashboard
- Added automated tests for shared TypeScript components
- Collaborated with backend engineers on REST API integrations

Sample Web Studio — Junior Developer
2020 – 2022
- Maintained responsive marketing websites
- Improved reusable UI components

EDUCATION
Example University — Bachelor of Science in Computer Science
2020`;
const syntheticJobDescription = `Example Products is hiring a Frontend Engineer.

Responsibilities
- Build accessible product interfaces with React and TypeScript
- Integrate frontend features with REST APIs
- Write automated tests and participate in code review

Requirements
- Experience with React, TypeScript, responsive design, and testing
- Clear communication and cross-functional collaboration`;

test("an account user tailors from only a saved master resume", async ({ page }) => {
  test.skip(!connectionString, "DATABASE_URL is required for account E2E tests");
  test.skip(!providerConfigured, "OPENROUTER_API_KEY is required for generation E2E tests");
  test.setTimeout(180_000);

  const testId = randomUUID();
  const email = `opti-generation-${testId}@example.test`;
  const password = `LocalTest-${testId}!`;
  const sql = postgres(connectionString!, { prepare: false });
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  try {
    await page.goto("/signup");
    await page.getByLabel("Full name").fill("Alex Example");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/dashboard/generator");
    await expect(page.getByRole("heading", { name: "Save your master résumé first" })).toBeVisible();
    await page.getByRole("link", { name: "Go to master résumé" }).click();

    await page.getByLabel("Full, unedited career experience").fill(syntheticResume);
    await page.getByRole("button", { name: "Save master resume" }).click();
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Tailor for a role" }).click();

    await expect(page).toHaveURL(/\/dashboard\/generator$/);
    await expect(page.getByText("Using your saved master résumé")).toBeVisible();
    await expect(page.getByLabel("Job description")).toBeVisible();
    await expect(page.getByLabel("Full, unedited career experience")).toHaveCount(0);

    await page.getByLabel("Job description").fill(syntheticJobDescription);
    await page.getByRole("button", { name: "Tailor my résumé" }).click();
    await expect(page.getByRole("heading", { name: "Alex Example" })).toBeVisible({
      timeout: 120_000,
    });

    const downloadStarted = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download PDF" }).click();
    const download = await downloadStarted;
    expect(download.suggestedFilename()).toBe("Alex_Example_Resume.pdf");
    const downloadedPath = await download.path();
    expect(downloadedPath).not.toBeNull();
    const pdfBytes = await readFile(downloadedPath!);
    expect(pdfBytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdfBytes.byteLength).toBeGreaterThan(2_000);
    expect(browserErrors).toEqual([]);
  } finally {
    await sql`delete from users where email = ${email}`;
    await sql.end();
  }
});
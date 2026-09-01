import { expect, test } from "@playwright/test";

test("guest generation stops for explicit missing-contact review", async ({ page }) => {
  await page.goto("/try");
  await page.getByLabel("Master résumé").fill(`Taylor Doe
taylor@example.com

EXPERIENCE
Product Designer at Example Co, 2021 - Present`);
  await page.getByLabel("Job description").fill(
    "Seeking a product designer with SaaS and accessibility experience.",
  );

  await page.getByRole("button", { name: "Tailor my résumé" }).click();

  await expect(
    page.getByRole("heading", { name: "Complete your contact details" }),
  ).toBeVisible();
  await expect(page.getByLabel("Phone number")).toBeVisible();
  await expect(page.getByLabel("LinkedIn profile")).toBeVisible();
  await expect(page.getByLabel("Portfolio website")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add details and continue" }))
    .toBeVisible();
  await expect(page.getByRole("button", { name: "Continue without them" }))
    .toBeVisible();
  await expect(page.getByText("Your tailored résumé will appear here")).toBeVisible();
});

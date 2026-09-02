import { expect, test } from "@playwright/test";

test.describe("user lifecycle routing", () => {
  test("anonymous users are sent to login with a preserved dashboard destination", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard$/);
  });

  test("anonymous generator access preserves the generator destination", async ({ page }) => {
    await page.goto("/dashboard/generator");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard%2Fgenerator$/);
  });

  test("unsafe callback URLs fall back to the dashboard", async ({ page }) => {
    await page.goto("/login?callbackUrl=https%3A%2F%2Fevil.example");
    await expect(page.getByRole("heading", { name: "Pick up where you left off." })).toBeVisible();
    await page.getByLabel("Email address").fill("demo@example.test");
    await page.getByLabel("Password").fill("invalid-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login\?callbackUrl=https%3A%2F%2Fevil\.example/);
  });

  test("guest users can return home and see the shared footer", async ({ page }) => {
    await page.goto("/try");
    await expect(page.getByRole("contentinfo")).toContainText("One truthful source. Sharper applications.");
    await page.getByRole("link", { name: "Opti home" }).last().click();
    await expect(page).toHaveURL(/\/$/);
  });
});

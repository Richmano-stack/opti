import { expect, type Page } from "@playwright/test";

/**
 * Register through the product UI, mark the isolated test account verified,
 * then authenticate through the normal sign-in flow without relying on email.
 */
export async function signUpAndSignIn(
  page: Page,
  email: string,
  password: string,
  verifyUser: (email: string) => Promise<void>,
) {
  await page.goto("/signup");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm Password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();

  await verifyUser(email);

  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/dashboard\/generator$/);
}

import { expect, test } from "@playwright/test";

test("guest workspace follows the approved responsive layout", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/try");

  const source = page.getByRole("complementary", { name: "Studio source inputs and insights" });
  const result = page.getByRole("region", { name: "Résumé canvas" });
  const button = page.getByRole("button", { name: "Tailor my résumé" });

  await expect(page.getByRole("heading", { name: "New tailored résumé" })).toBeVisible();
  await expect(source).toBeVisible();
  await expect(result).toBeVisible();

  const desktopSource = await source.boundingBox();
  const desktopResult = await result.boundingBox();
  expect(desktopSource).not.toBeNull();
  expect(desktopResult).not.toBeNull();
  expect(desktopSource!.x).toBeLessThan(desktopResult!.x);

  await expect(button).toBeDisabled();

  await page.getByRole("button", { name: "Use Sample Resume & Job" }).click();
  await expect(button).toBeEnabled();
  await page.getByRole("tab", { name: "Résumé" }).click();
  await expect(page.getByLabel("Master résumé")).toContainText("Jane Martinez");
  await page.getByRole("tab", { name: "Job" }).click();
  await page.getByRole("button", { name: "Clear guest draft" }).click();
  await expect(button).toBeDisabled();

  await page.screenshot({ path: "test-results/ui-audit/guest-desktop.png", fullPage: true });

  await page.setViewportSize({ width: 320, height: 900 });
  await page.reload();

  await expect(page.getByRole("tab", { name: "Input & tailoring" })).toBeVisible();
  await expect(source).toBeVisible();
  const inputOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(inputOverflow).toBe(false);
  await page.getByRole("tab", { name: "Live preview" }).click();
  await expect(result).toBeVisible();

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(horizontalOverflow).toBe(false);
  expect(consoleErrors).toEqual([]);

  await page.screenshot({ path: "test-results/ui-audit/guest-mobile.png", fullPage: true });
});

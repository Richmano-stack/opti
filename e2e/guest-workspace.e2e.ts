import { expect, test } from "@playwright/test";

test("guest workspace follows the approved responsive layout", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/try");

  const source = page.getByRole("region", { name: "Source documents" });
  const result = page.getByRole("region", { name: "Your tailored résumé" });
  const button = page.getByRole("button", { name: "Tailor my résumé" });

  await expect(page.getByRole("heading", { name: "Tailor your résumé for this role" })).toBeVisible();
  await expect(source).toBeVisible();
  await expect(result).toBeVisible();

  const desktopSource = await source.boundingBox();
  const desktopResult = await result.boundingBox();
  expect(desktopSource).not.toBeNull();
  expect(desktopResult).not.toBeNull();
  expect(desktopSource!.x).toBeLessThan(desktopResult!.x);

  const buttonStyle = await button.evaluate((element) => {
    const styles = getComputedStyle(element);
    return { backgroundImage: styles.backgroundImage, borderWidth: styles.borderTopWidth };
  });
  expect(buttonStyle.backgroundImage).toContain("linear-gradient");
  expect(buttonStyle.borderWidth).toBe("0px");

  await page.screenshot({ path: "test-results/ui-audit/guest-desktop.png", fullPage: true });

  await page.setViewportSize({ width: 320, height: 900 });
  await page.reload();

  const mobileSource = await source.boundingBox();
  const mobileResult = await result.boundingBox();
  expect(mobileSource).not.toBeNull();
  expect(mobileResult).not.toBeNull();
  expect(mobileSource!.y).toBeLessThan(mobileResult!.y);

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(horizontalOverflow).toBe(false);
  expect(consoleErrors).toEqual([]);

  await page.screenshot({ path: "test-results/ui-audit/guest-mobile.png", fullPage: true });
});

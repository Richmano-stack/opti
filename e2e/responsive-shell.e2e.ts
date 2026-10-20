import { randomUUID } from "node:crypto";

import { expect, test, type Page } from "@playwright/test";
import postgres from "postgres";

const breakpoints = [320, 375, 768, 1024, 1440] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test("authenticated shell follows the documented responsive navigation rules", async ({ page }) => {
  const connectionString = process.env.DATABASE_URL;
  test.skip(!connectionString, "DATABASE_URL is required for responsive shell tests");
  const id = randomUUID();
  const email = `opti-responsive-${id}@example.test`;
  const password = `Responsive-${id}!`;
  const sql = postgres(connectionString!, { prepare: false });

  try {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/signup");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/\/dashboard\/templates$/);

    for (const path of ["/dashboard", "/dashboard/generator"]) {
      await page.goto(path);
      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 800 });
        const sidebarToggle = page.getByRole("button", { name: "Toggle Sidebar" });
        const desktopSidebar = page.getByRole("complementary", { name: "Desktop workspace sidebar" });
        if (width < 768) {
          await expect(sidebarToggle).toBeVisible();
          await expect(desktopSidebar).toBeHidden();
        } else {
          await expect(desktopSidebar).toBeVisible();
        }
        await expectNoHorizontalOverflow(page);
      }
    }

    await page.goto("/dashboard");
    await page.setViewportSize({ width: 320, height: 720 });
    const menuTrigger = page.getByRole("button", { name: "Toggle Sidebar" });
    await expect(menuTrigger).toBeVisible();

    await page.setViewportSize({ width: 375, height: 800 });
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    const drawer = page.getByRole("dialog", { name: "Sidebar" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Master résumé" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  } finally {
    await sql`delete from users where email = ${email}`;
    await sql.end();
  }
});

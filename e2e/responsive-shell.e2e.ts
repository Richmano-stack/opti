import { randomUUID } from "node:crypto";

import { expect, test, type Page } from "@playwright/test";
import postgres from "postgres";

import { signUpAndSignIn } from "./support/auth";
import { cleanupPreservingTestFailure } from "./support/cleanup";

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

  let testFailure: unknown;
  try {
    await page.setViewportSize({ width: 320, height: 720 });
    await signUpAndSignIn(page, email, password, async (testEmail) => {
      await sql`update users set email_verified = true where email = ${testEmail}`;
    });

    for (const path of ["/dashboard", "/dashboard/generator"]) {
      await page.goto(path);
      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 800 });
        const sidebarToggle = page.locator('[data-slot="sidebar-trigger"]');
        const desktopSidebar = page.locator('[data-slot="sidebar"]');
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
    const menuTrigger = page.locator('[data-slot="sidebar-trigger"]');
    await expect(menuTrigger).toBeVisible();

    await page.setViewportSize({ width: 375, height: 800 });
    await page.locator('[data-slot="sidebar-trigger"]').click();
    const drawer = page.getByRole("dialog", { name: "Sidebar" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Master résumé" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  } catch (error: unknown) {
    testFailure = error;
    throw error;
  } finally {
    await cleanupPreservingTestFailure(
      async () => {
        await sql`delete from verification where identifier = ${email}`;
        await sql`delete from users where email = ${email}`;
      },
      () => sql.end(),
      testFailure,
    );
  }
});

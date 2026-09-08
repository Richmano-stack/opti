import { expect, type Page } from "@playwright/test";

export const authenticatedViewports = [
  { name: "mobile-compact", viewport: { width: 320, height: 640 } },
  { name: "mobile", viewport: { width: 375, height: 812 } },
  { name: "tablet", viewport: { width: 768, height: 1024 } },
  { name: "desktop", viewport: { width: 1024, height: 768 } },
  { name: "desktop-wide", viewport: { width: 1440, height: 960 } },
] as const;

export function collectBrowserErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return { errors };
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth, `Page overflowed horizontally: ${dimensions.scrollWidth}px content in ${dimensions.clientWidth}px viewport`).toBeLessThanOrEqual(dimensions.clientWidth);
}

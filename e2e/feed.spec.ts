import { test, expect } from "@playwright/test";

test.describe("Home Feed", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Your Feed")).toBeVisible();
  });

  test("shows post cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('a[href*="/testuser/"]');
    await expect(cards.first()).toBeVisible();
  });

  test("explore page loads", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.getByText("Explore")).toBeVisible();
  });
});

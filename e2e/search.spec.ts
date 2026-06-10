import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("search returns results", async ({ page }) => {
    await page.goto("/explore?q=generative");
    await expect(page.getByText(/Results for/)).toBeVisible();
  });

  test("search with no results shows empty state", async ({ page }) => {
    await page.goto("/explore?q=xyznotfound123");
    await expect(page.getByText(/No posts found/)).toBeVisible();
  });
});

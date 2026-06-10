import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("sign up page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Create your account")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("redirects to login when accessing protected route", async ({
    page,
  }) => {
    await page.goto("/write");
    await expect(page).toHaveURL(/login/);
  });

  test("forgot password page loads", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByText("Reset your password")).toBeVisible();
  });
});

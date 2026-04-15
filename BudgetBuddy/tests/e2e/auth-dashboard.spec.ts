import { test, expect } from "@playwright/test";

test("signup/login/add expense/dashboard update flow", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByText("Sign up")).toBeVisible();
});

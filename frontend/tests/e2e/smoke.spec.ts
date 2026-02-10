import { test, expect } from "@playwright/test"

test("home renders header and main content", async ({ page }) => {
    await page.goto("/")

    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator("main")).toBeVisible()
})

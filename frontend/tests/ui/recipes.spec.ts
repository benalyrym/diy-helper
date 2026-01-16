import { test, expect } from "@playwright/test"

test("Signup and login flows", async ({ page }) => {
    await page.goto("auth/signup")
    await page.fill("input[placeholder=Email]", "a@b.com")
    await page.fill("input[placeholder=Password]", "123456")
    await page.click("button:has-text('Signup')")

    await page.goto("/auth/login")
    await page.fill("input[placeholder=Email]", "a@b.com")
    await page.fill("input[placeholder=Password]", "123456")
    await page.click("button:has-text('Login')")

    await expect(page).toHaveURL("/recettes")
})

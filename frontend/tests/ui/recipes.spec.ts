import { test, expect } from "@playwright/test"

test.use({ baseURL: 'http://localhost:3000' })

test.describe("Authentication and Recipes", () => {
    // NOTE: Vous devez créer cet utilisateur dans votre backend AVANT de lancer les tests
    const TEST_EMAIL = 'test@test.com';
    const TEST_PASSWORD = 'password123';

    // Alternative: Créer l'utilisateur via API avant les tests
    async function createTestUser(email, password) {
        // Vous devrez implémenter cela selon votre API
        // Par exemple, faire un POST vers /api/signup
    }

    test.beforeAll(async () => {
        // Optionnel: Créer l'utilisateur de test avant tous les tests
        // await createTestUser(TEST_EMAIL, TEST_PASSWORD);

    });
    test("Test UI navigation without real auth", async ({ page }) => {
        // Mock toutes les requêtes d'authentification
        await page.route('http://localhost:4000/**', async route => {
            const url = route.request().url();

            if (url.includes('/login')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, user: { id: 1 } })
                });
            } else {
                await route.continue();
            }
        });

        // Test 1: Page de login
        await page.goto("/auth/login");
        await expect(page.locator('h1:has-text("Login")')).toBeVisible();
        await page.screenshot({ path: 'test-login-ui.png' });

        // Test 2: Remplir le formulaire (mais ne pas soumettre réellement)
        await page.fill('input[placeholder="Email"]', 'test@example.com');
        await page.fill('input[placeholder="Password"]', 'password');

        // Test 3: Page de signup
        await page.goto("/auth/signup");
        await expect(page.locator('h1:has-text("Signup")')).toBeVisible();
        await page.screenshot({ path: 'test-signup-ui.png' });

        console.log('UI tests passed without real authentication');
    });

    test("Successful login redirects to home page", async ({ page }) => {
        await page.route('http://localhost:4000/**', async route => {
            const url = route.request().url();

            if (url.includes('/login')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, user: { id: 1 } })
                });
            } else {
                await route.continue();
            }
        });

        // Test 1: Page de login
        await page.goto("/auth/login");
        await expect(page.locator('h1:has-text("Login")')).toBeVisible();
        await page.screenshot({ path: 'test-login-ui.png' });

        // Test 2: Remplir le formulaire (mais ne pas soumettre réellement)
        await page.fill('input[placeholder="Email"]', 'test@example.com');
        await page.fill('input[placeholder="Password"]', 'password');
        await page.click('button')

        // 6. Vérifier la redirection
        try {
            // Attendre la redirection vers la page d'accueil ("/")
            await page.waitForURL('**/', { timeout: 5000 });

            const currentUrl = page.url();
            console.log('Successfully redirected to:', currentUrl);

            // Vérifier qu'on est sur la page d'accueil
            expect(currentUrl).toBe('http://localhost:3000/');

            // Vérifier les éléments de la page d'accueil
            await expect(page.locator('h1:has-text("DIY Recipe Helper")')).toBeVisible();
            await expect(page.locator('button:has-text("Déconnexion")')).toBeVisible();

            console.log('Login successful!');

            // Prendre une capture d'écran de succès
            await page.screenshot({ path: 'login-success.png' });

        } catch (error) {
            console.log('Login failed or no redirect:', error.message);

            // Vérifier les messages d'erreur
            const errorElement = page.locator('.text-red-500');
            if (await errorElement.isVisible()) {
                const errorText = await errorElement.textContent();
                console.log('Error message on page:', errorText);

                // Si c'est "Invalid credentials", l'utilisateur n'existe pas
                if (errorText?.includes('Invalid credentials')) {
                    console.log('PROBLEM: User does not exist or wrong password');
                    console.log('SOLUTION: Create user with email:', TEST_EMAIL, 'and password:', TEST_PASSWORD);
                }
            }

            // Prendre une capture d'écran d'échec
            await page.screenshot({ path: 'login-failed.png' });

            throw error;
        }
    });

    test("Navigate to recipes page after login", async ({ page }) => {
        await page.route('http://localhost:4000/**', async route => {
            const url = route.request().url();

            if (url.includes('/login')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, user: { id: 1 } })
                });
            } else {
                await route.continue();
            }
        });

        // Test 1: Page de login
        await page.goto("/auth/login");
        await expect(page.locator('h1:has-text("Login")')).toBeVisible();
        await page.screenshot({ path: 'test-login-ui.png' });

        // Test 2: Remplir le formulaire (mais ne pas soumettre réellement)
        await page.fill('input[placeholder="Email"]', 'test@example.com');
        await page.fill('input[placeholder="Password"]', 'password');


        // 4. Attendre la navigation vers /recettes
        await page.waitForURL('**/recettes', { timeout: 5000 });

        // 5. Vérifier la page des recettes
        await expect(page).toHaveURL(/\/recettes$/);

        // Vérifier le titre de la page
        const pageTitle = await page.locator('h1').first().textContent();
        console.log('Recipes page title:', pageTitle);

        // Vérifier la présence du bouton "Nouvelle recette"
        await expect(page.locator('a:has-text("Nouvelle recette")')).toBeVisible();

        console.log('Successfully navigated to recipes page!');
        await page.screenshot({ path: 'recipes-page-after-login.png' });
    });

    test("Full auth flow with signup", async ({ page }) => {
        test.setTimeout(60000);

        // Créer un email unique pour ce test
        const timestamp = Date.now();
        const uniqueEmail = `test${timestamp}@test.com`;
        const password = 'Test123!';

        console.log(`Testing with new user: ${uniqueEmail}`);

        // ÉTAPE 1: SIGNUP
        console.log('1. Signup...');
        await page.goto("/auth/signup");

        // Vérifier la page de signup
        await expect(page.locator('h1:has-text("Signup")')).toBeVisible();

        // Remplir le formulaire de signup
        // Note: Ajustez les placeholders selon votre page de signup
        await page.fill('input[placeholder="Email"], input[placeholder="email"]', uniqueEmail);
        await page.fill('input[placeholder="Password"], input[placeholder="password"]', password);

        // Observer les requêtes API
        page.on('response', response => {
            const url = response.url();
            const status = response.status();
            if (url.includes('localhost:4000') && url.includes('/signup')) {
                console.log(`Signup API: ${status} ${url}`);
            }
        });

        // Cliquer sur Signup
        await page.click('button:has-text("Signup"), button:has-text("S\'inscrire")');

        // Attendre la redirection
        try {
            await page.waitForURL('**/', { timeout: 10000 });
            console.log('Signup successful, redirected to homepage');
        } catch (error) {
            console.log('Signup may have failed or no redirect');

            // Vérifier les erreurs
            const errorElement = page.locator('.text-red-500');
            if (await errorElement.isVisible()) {
                const errorText = await errorElement.textContent();
                console.log('Signup error:', errorText);
            }

            // Si signup échoue, continuer avec le login (peut-être que l'utilisateur existe déjà)
            console.log('Trying login instead...');
        }

        // ÉTAPE 2: LOGOUT
        console.log('2. Logout...');
        await page.click('button:has-text("Déconnexion")');

        // Attendre la redirection vers login
        await page.waitForURL('**/auth/login', { timeout: 5000 });

        // ÉTAPE 3: LOGIN avec le nouvel utilisateur
        console.log('3. Login with new user...');
        await page.fill('input[placeholder="Email"]', uniqueEmail);
        await page.fill('input[placeholder="Password"]', password);
        await page.click('button:has-text("Login")');

        // Attendre la redirection vers la page d'accueil
        await page.waitForURL('**/', { timeout: 10000 });

        console.log('Full auth flow completed successfully!');
        await page.screenshot({ path: 'full-auth-flow.png' });
    });

    test("Test logout functionality", async ({ page }) => {
        test.setTimeout(30000);

        // 1. Login
        await page.goto("/auth/login");
        await page.fill('input[placeholder="Email"]', TEST_EMAIL);
        await page.fill('input[placeholder="Password"]', TEST_PASSWORD);
        await page.click('button:has-text("Login")');

        // 2. Vérifier qu'on est connecté (sur la page d'accueil)
        await page.waitForURL('**/', { timeout: 10000 });
        await expect(page.locator('button:has-text("Déconnexion")')).toBeVisible();

        // 3. Logout
        await page.click('button:has-text("Déconnexion")');

        // 4. Vérifier la redirection vers login
        await page.waitForURL('**/auth/login', { timeout: 5000 });

        // 5. Vérifier qu'on ne peut pas accéder à la page protégée
        await page.goto("/");

        // Devrait être redirigé vers /auth/login
        await page.waitForURL('**/auth/login', { timeout: 5000 });

        console.log('Logout test passed!');
    });
});
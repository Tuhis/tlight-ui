import { test, expect } from '@playwright/test';

test.describe('App Load and Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the API endpoint
        await page.route('**/v1/lights/nodes', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    nodes: [
                        {
                            id: 'test-node-1',
                            name: 'Test Node 1',
                            type: 'ledstrip',
                            features: {
                                count: 10,
                                addressable: true,
                                color: true
                            },
                            state: {
                                mode: 'SINGLE',
                                brightness: 100,
                                color: { red: 255, green: 0, blue: 0 }
                            },
                            lights: []
                        }
                    ]
                })
            });
        });
    });

    test('should redirect root URL to /nodes', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });

        // Wait for redirect
        await page.waitForURL('/nodes');

        // Verify we're on the nodes page
        await expect(page).toHaveURL('/nodes');
    });

    test('should display sidebar on wide viewport', async ({ page }) => {
        // Set viewport to wide (desktop)
        await page.setViewportSize({ width: 1400, height: 900 });

        await page.goto('/nodes', { waitUntil: 'networkidle' });

        // Wait for the sidebar to be rendered
        await page.waitForSelector('[data-testid="nav-nodes"]', { timeout: 10000 });

        // Sidebar navigation should be visible
        const sidebarNode = page.getByTestId('nav-nodes').first();
        await expect(sidebarNode).toBeVisible();
    });

    test('should navigate to nodes page when clicking Nodes link', async ({ page }) => {
        await page.goto('/effects', { waitUntil: 'networkidle' });

        // Wait for nav to be ready
        await page.waitForSelector('[data-testid="nav-nodes"]');

        // Click the Nodes nav item
        await page.getByTestId('nav-nodes').first().click();

        // Should navigate to /nodes
        await expect(page).toHaveURL('/nodes');
    });

    test('should navigate to effects page when clicking Effects link', async ({ page }) => {
        await page.goto('/nodes', { waitUntil: 'networkidle' });

        // Wait for nav to be ready
        await page.waitForSelector('[data-testid="nav-effects"]');

        // Click the Effects nav item
        await page.getByTestId('nav-effects').first().click();

        // Should navigate to /effects
        await expect(page).toHaveURL('/effects');
    });

    test('should display breadcrumbs with current path', async ({ page }) => {
        await page.goto('/nodes', { waitUntil: 'networkidle' });

        // Wait for breadcrumbs to render
        // Wait for breadcrumbs to render
        const breadcrumb = page.getByTestId('breadcrumbs');
        await expect(breadcrumb).toContainText('Nodes', { timeout: 10000 });
    });

    test('should handle navigation to groups page', async ({ page }) => {
        await page.goto('/nodes', { waitUntil: 'networkidle' });

        // Wait for nav to be ready
        await page.waitForSelector('[data-testid="nav-groups"]');

        // Click Groups nav item
        await page.getByTestId('nav-groups').first().click();

        // Should navigate to /groups
        await expect(page).toHaveURL('/groups');
    });

    test('should persist navigation in browser history', async ({ page }) => {
        await page.goto('/nodes', { waitUntil: 'networkidle' });

        // Wait for nav to be ready
        await page.waitForSelector('[data-testid="nav-effects"]');

        // Click Effects
        await page.getByTestId('nav-effects').first().click();
        await expect(page).toHaveURL('/effects');

        // Go back
        await page.goBack();
        await expect(page).toHaveURL('/nodes');

        // Go forward
        await page.goForward();
        await expect(page).toHaveURL('/effects');
    });
});

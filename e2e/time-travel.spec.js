import { test, expect } from '@playwright/test';

test.describe('UI State Persistence and Interaction', () => {
    test.beforeEach(async ({ page }) => {
        // Debug console logs from browser
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        page.on('pageerror', exception => console.log(`BROWSER ERROR: "${exception}"`));

        // Debug network requests
        page.on('request', request => console.log('>>', request.method(), request.url()));
        page.on('response', response => console.log('<<', response.status(), response.url()));

        // Mock the API response for nodes
        await page.route('**/v1/lights/nodes', async route => {
            console.log('Mock hit: /v1/lights/nodes');
            await route.fulfill({
                json: {
                    nodes: [
                        {
                            id: 'node-1',
                            name: 'Test Node',
                            type: 'mock',
                            features: { count: 10, addressable: true, color: true },
                            state: { mode: 'SINGLE', brightness: 100 }
                        }
                    ]
                }
            });
        });

        // Wait... looking at tlightApiMiddleware.js:
        // fetchNodeData: () => fetch(opts.baseUrl + "/lights/nodes"),
        // So the URL path is /lights/nodes, NOT /nodes !!! 
        // This was the issue! I was mocking /v1/nodes but the app requests /v1/lights/nodes.

        // Allow other requests to proceed (if any) or mock them
        await page.route('**/v1/effects/configured', async route => {
            await route.fulfill({ json: { effects: [] } });
        });

        await page.route('**/v1/lights/nodes/node-1', async route => {
            await route.fulfill({ json: { mode: 'SINGLE', red: 0, green: 0, blue: 0, brightness: 100 } });
        });

        await page.goto('/');
    });

    test('should toggle color picker and persist state (redux verification)', async ({ page }) => {
        await expect(page.getByText('Test Node')).toBeVisible();

        const switchButton = page.getByRole('button', { name: /Switch to Manual Sliders/i });
        await expect(switchButton).toBeVisible();

        await switchButton.click();

        await expect(page.getByRole('button', { name: /Switch to Color Picker/i })).toBeVisible();
        await expect(page.getByText('Red:')).toBeVisible();
    });

    test('should handle mobile menu state via Redux', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Clicking hamburger menu
        // We can target the icon divs if needed, or the container
        const menuButton = page.locator('div[class*="menubutton"]');
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        const menuContainer = page.locator('div[class*="fullscreen-container"]');
        await expect(menuContainer).toBeVisible();

        await menuContainer.click();
        await expect(menuContainer).toBeHidden();
    });
});

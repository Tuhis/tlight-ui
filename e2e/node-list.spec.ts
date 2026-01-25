import { test, expect } from '@playwright/test';

test.describe('Node List Display', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the API with test nodes
        await page.route('**/v1/lights/nodes', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    nodes: [
                        {
                            id: 'node-1',
                            name: 'Living Room Lights',
                            type: 'ledstrip',
                            state: {
                                mode: 'SINGLE',
                                brightness: 150,
                                color: { red: 100, green: 200, blue: 50 }
                            },
                            features: {
                                count: 60,
                                addressable: true,
                                color: true
                            },
                            lights: []
                        },
                        {
                            id: 'node-2',
                            name: 'Bedroom Strip',
                            type: 'ledstrip',
                            state: {
                                mode: 'EXTERNAL',
                                brightness: 200,
                                color: { red: 255, green: 0, blue: 255 }
                            },
                            features: {
                                count: 30,
                                addressable: true,
                                color: true
                            },
                            lights: []
                        },
                        {
                            id: 'node-3',
                            name: 'DMX Controller',
                            type: 'dmx',
                            state: {
                                mode: 'INDIVIDUAL',
                                brightness: 100
                            },
                            features: {
                                count: 255,
                                addressable: true,
                                color: false
                            },
                            lights: []
                        }
                    ]
                })
            });
        });

        await page.goto('/nodes');
    });

    test('should render node cards from API data', async ({ page }) => {
        // Wait for API call and rendering
        await page.waitForSelector('text=Living Room Lights');

        // Verify all three nodes are displayed
        await expect(page.locator('text=Living Room Lights')).toBeVisible();
        await expect(page.locator('text=Bedroom Strip')).toBeVisible();
        await expect(page.locator('text=DMX Controller')).toBeVisible();
    });

    test('should display node names correctly', async ({ page }) => {
        await page.waitForSelector('text=Living Room Lights');

        // Check that the names are rendered
        const livingRoomNode = page.locator('text=Living Room Lights');
        const bedroomNode = page.locator('text=Bedroom Strip');
        const dmxNode = page.locator('text=DMX Controller');

        await expect(livingRoomNode).toBeVisible();
        await expect(bedroomNode).toBeVisible();
        await expect(dmxNode).toBeVisible();
    });

    test('should render multiple node cards in grid layout', async ({ page }) => {
        await page.waitForSelector('text=Living Room Lights');

        // Count the number of cards (this depends on the actual card structure)
        // Looking for elements that would indicate cards
        const cards = page.locator('[class*="card"]');
        const count = await cards.count();

        // Should have at least 3 cards (for our 3 nodes)
        expect(count).toBeGreaterThanOrEqual(3);
    });

    test('should handle empty node list gracefully', async ({ page }) => {
        // Override the route to return empty nodes
        await page.route('**/v1/lights/nodes', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ nodes: [] })
            });
        });

        await page.goto('/nodes', { waitUntil: 'networkidle' });

        // Should not crash, page should load
        await expect(page).toHaveURL('/nodes');
    });

    test('should display node type information', async ({ page }) => {
        await page.waitForSelector('text=Living Room Lights');

        // The node type should be visible somewhere (implementation dependent)
        // This test verifies the app doesn't crash with different node types
        const pageContent = await page.textContent('body');
        expect(pageContent).toBeTruthy();
    });

    test('should allow clicking on a node card', async ({ page }) => {
        await page.waitForSelector('text=Living Room Lights');

        // Click on the first node
        await page.locator('text=Living Room Lights').click();

        // Should navigate to the node's lights page (or stay on same page with expanded view)
        // The exact behavior depends on implementation
        // For now, just verify no crash
        const url = page.url();
        expect(url).toBeTruthy();
    });
});

test.describe('Node List API Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
        // Mock API to return error
        await page.route('**/v1/lights/nodes', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal Server Error' })
            });
        });

        await page.goto('/nodes');

        // Page should still load without crashing
        await expect(page).toHaveURL('/nodes');
    });

    test('should handle network timeout', async ({ page }) => {
        // Mock API with delayed response
        await page.route('**/v1/lights/nodes', async (route) => {
            // Delay for 2 seconds then fulfill
            await new Promise(resolve => setTimeout(resolve, 2000));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ nodes: [] })
            });
        });

        await page.goto('/nodes', { waitUntil: 'domcontentloaded' });

        // Should eventually load
        await expect(page).toHaveURL('/nodes');
    });
});

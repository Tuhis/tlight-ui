
import { test, expect } from '@playwright/test';

test.describe('SmoothColors Effect Card', () => {
    test.beforeEach(async ({ page }) => {
        // Clear local storage to ensure clean state
        await page.goto('/effects'); // Need to load page to access localStorage
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('should allow creating SmoothColors effect and toggling color picker', async ({ page }) => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', exception => console.log('PAGE ERROR:', exception));

        // 1. Click "Add New" to create a new effect
        await page.click('text=Add New');

        // 2. Find the effect card. It should have title "Effect Name".
        // 2. Find the effect card. It should have title "Effect Name".
        await expect(page.locator('input[value="Effect Name"]')).toBeVisible();

        // 3. Select "SmoothColors" from the dropdown
        // The dropdown initially shows "No data" or similar because type is null?
        // Let's click the dropdown trigger.
        // Assuming there is only one dropdown on the screen since we cleared effects.
        // Dropdown renders with class starting with "Dropdown_dropdown".
        // simple locator:
        const dropdown = page.locator('.Dropdown_dropdown__1r1hE'); // using class hash is risky. 
        // Better: look for element that looks like dropdown.
        // Or finding by text inside it. 
        // Initial text might be "No data" if selectedItemIndex is invalid.
        // EffectCard logic: effectTypeIndex = _.findIndex... if not found -1. Dropdown prop selectedItemIndex might be -1?
        // Dropdown component: `const selectedItem = _.get(this.props.data, [this.state.selectedItemIndex, "label"], "No data");`
        // If index is -1, get([-1, "label"]) -> undefined -> "No data".

        await page.locator('text=No data').click();

        // 4. Select "SmoothColors" from the list
        await page.locator('li >> text=SmoothColors').click();

        // 5. Verify the toggle button appears. Default should be "Switch to Manual Sliders" (as Color Picker is default)
        const toggleButton = page.locator('button', { hasText: 'Switch to Manual Sliders' });
        await expect(toggleButton).toBeVisible();

        // 6. Click toggle
        await toggleButton.click();

        // 7. Verify it changes to "Switch to Color Picker"
        const toggleButtonSwitched = page.locator('button', { hasText: 'Switch to Color Picker' });
        await expect(toggleButtonSwitched).toBeVisible();

        // 8. Verify "red" label is visible (Slider mode)
        // There are start and end colors, so multiple "red"s.
        await expect(page.locator('text=red').first()).toBeVisible();

        // 9. Verify default values (Min/Max/Default feature)
        // Duration should be 5 (default), min 1, max 255.
        // Finding the input next to "duration" label.
        // Structure: Row > div > "duration" ... next col > slider & input
        // Using layout selector might be tricky, let's look for input with value 5
        const durationInput = page.locator('input[value="5"]').first();
        await expect(durationInput).toBeVisible();
    });
});

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

window.jest = vi; // Shim jest for legacy tests if needed

window.matchMedia = (query) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
});

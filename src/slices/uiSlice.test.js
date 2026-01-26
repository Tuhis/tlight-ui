import uiReducer, { setMobileMenuOpen, toggleMobileMenu, setCardPreference } from './uiSlice';

describe('ui reducer', () => {
    const initialState = {
        global: {
            mobileMenuOpen: false
        },
        preferences: {}
    };

    it('should handle initial state', () => {
        expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setMobileMenuOpen', () => {
        const actual = uiReducer(initialState, setMobileMenuOpen(true));
        expect(actual.global.mobileMenuOpen).toEqual(true);
    });

    it('should handle toggleMobileMenu', () => {
        const step1 = uiReducer(initialState, toggleMobileMenu());
        expect(step1.global.mobileMenuOpen).toEqual(true);
        const step2 = uiReducer(step1, toggleMobileMenu());
        expect(step2.global.mobileMenuOpen).toEqual(false);
    });

    it('should handle setCardPreference', () => {
        const actual = uiReducer(initialState, setCardPreference({
            id: 'node1',
            key: 'useColorPicker',
            value: true
        }));
        expect(actual.preferences['node1']).toEqual({ useColorPicker: true });

        // Update existing preference
        const actual2 = uiReducer(actual, setCardPreference({
            id: 'node1',
            key: 'useColorPicker',
            value: false
        }));
        expect(actual2.preferences['node1']).toEqual({ useColorPicker: false });
    });
});

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    global: {
        mobileMenuOpen: false
    },
    preferences: {}
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setMobileMenuOpen: (state, action) => {
            state.global.mobileMenuOpen = action.payload;
        },
        toggleMobileMenu: (state) => {
            state.global.mobileMenuOpen = !state.global.mobileMenuOpen;
        },
        setCardPreference: (state, action) => {
            const { id, key, value } = action.payload;

            if (!state.preferences[id]) {
                state.preferences[id] = {};
            }
            state.preferences[id][key] = value;
        }
    }
});

export const { setMobileMenuOpen, toggleMobileMenu, setCardPreference } = uiSlice.actions;

export default uiSlice.reducer;

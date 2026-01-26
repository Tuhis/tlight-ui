import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LightCard from './LightCard';
import { setCardPreference } from '../../../slices/uiSlice';
import { vi } from 'vitest';

const mockStore = configureStore([]);

describe('LightCard', () => {
    let store;

    const initialState = {
        nodes: {
            'node-1': {
                id: 'node-1',
                features: { color: true }
            }
        },
        lightValues: {
            'node-1': {
                'light-1': {
                    brightness: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }
            }
        },
        ui: {
            preferences: {}
        }
    };

    beforeEach(() => {
        store = mockStore(initialState);
        store.dispatch = vi.fn();
    });

    it('should toggle Color Picker preference via Redux', () => {
        render(
            <Provider store={store}>
                <LightCard nodeId="node-1" id="light-1" />
            </Provider>
        );

        // Default is useColorPicker = true
        const toggleButton = screen.getByText('Switch to Manual Sliders');
        fireEvent.click(toggleButton);

        expect(store.dispatch).toHaveBeenCalledWith(setCardPreference({
            id: 'node-1_light-1',
            key: 'useColorPicker',
            value: false
        }));
    });

    it('should render manual sliders when preference is false', () => {
        const stateWithPref = {
            ...initialState,
            ui: {
                preferences: {
                    'node-1_light-1': { useColorPicker: false }
                }
            }
        };
        store = mockStore(stateWithPref);

        render(
            <Provider store={store}>
                <LightCard nodeId="node-1" id="light-1" />
            </Provider>
        );

        expect(screen.getByText('Switch to Color Picker')).toBeInTheDocument();
    });
});

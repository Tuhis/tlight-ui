import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import NodeCard from './NodeCard';
import { setCardPreference } from '../../../slices/uiSlice';
import { vi } from 'vitest';

const mockStore = configureStore([]);

describe('NodeCard', () => {
    let store;

    const createInitialState = (features = {}) => ({
        nodes: {
            'node-1': {
                id: 'node-1',
                name: 'Test Node',
                type: 'mock',
                features: {
                    count: 10,
                    addressable: false,
                    color: true,
                    animatable: false,
                    ...features
                }
            }
        },
        nodeValues: {
            'node-1': {
                mode: 'SINGLE',
                brightness: 100,
                red: 0,
                green: 0,
                blue: 0
            }
        },
        effects: {
            configuredEffects: [],
            effectsInUsePerNode: {
                'node-1': { effectId: 'none' }
            }
        },
        ui: {
            preferences: {}
        }
    });

    const renderComponent = (customState) => {
        store = mockStore(customState || createInitialState());
        store.dispatch = vi.fn();
        return render(
            <Provider store={store}>
                <MemoryRouter>
                    <NodeCard id="node-1" />
                </MemoryRouter>
            </Provider>
        );
    };

    it('should show only SINGLE and EXTERNAL for basic nodes', () => {
        renderComponent(createInitialState({ addressable: false, animatable: false }));

        // Click dropdown to open it
        // The header has text "SINGLE", so we click it.
        fireEvent.click(screen.getByText('SINGLE'));

        // Scope queries to the dropdown list
        const list = screen.getByRole('list');
        const { getByText, queryByText } = within(list);

        expect(getByText('SINGLE')).toBeInTheDocument();
        expect(getByText('EXTERNAL')).toBeInTheDocument();
        expect(queryByText('INDIVIDUAL')).not.toBeInTheDocument();
        expect(queryByText('ANIMATION')).not.toBeInTheDocument();
    });

    it('should show INDIVIDUAL for addressable nodes', () => {
        renderComponent(createInitialState({ addressable: true, animatable: false }));

        fireEvent.click(screen.getByText('SINGLE'));

        const list = screen.getByRole('list');
        const { getByText, queryByText } = within(list);

        expect(getByText('SINGLE')).toBeInTheDocument();
        expect(getByText('EXTERNAL')).toBeInTheDocument();
        expect(getByText('INDIVIDUAL')).toBeInTheDocument();
        expect(queryByText('ANIMATION')).not.toBeInTheDocument();
    });

    it('should show ANIMATION for animatable nodes', () => {
        renderComponent(createInitialState({ addressable: false, animatable: true }));

        fireEvent.click(screen.getByText('SINGLE'));

        const list = screen.getByRole('list');
        const { getByText, queryByText } = within(list);

        expect(getByText('SINGLE')).toBeInTheDocument();
        expect(getByText('EXTERNAL')).toBeInTheDocument();
        expect(queryByText('INDIVIDUAL')).not.toBeInTheDocument();
        expect(getByText('ANIMATION')).toBeInTheDocument();
    });

    it('should show all modes when both features are present', () => {
        renderComponent(createInitialState({ addressable: true, animatable: true }));

        fireEvent.click(screen.getByText('SINGLE'));

        const list = screen.getByRole('list');
        const { getByText } = within(list);

        expect(getByText('SINGLE')).toBeInTheDocument();
        expect(getByText('EXTERNAL')).toBeInTheDocument();
        expect(getByText('INDIVIDUAL')).toBeInTheDocument();
        expect(getByText('ANIMATION')).toBeInTheDocument();
    });

    it('should toggle Color Picker preference via Redux', () => {
        renderComponent();

        const toggleButton = screen.getByText('Switch to Manual Sliders');
        fireEvent.click(toggleButton);

        expect(store.dispatch).toHaveBeenCalledWith(setCardPreference({
            id: 'node-1',
            key: 'useColorPicker',
            value: false
        }));
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import App from './App';

// Mock container components
import { vi } from 'vitest';

vi.mock('./components/container/NodeCardGrid/NodeCardGrid', () => ({ default: () => <div data-testid="page-nodes">Node Page</div> }));
vi.mock('./components/container/EffectCardGrid/EffectCardGrid', () => ({ default: () => <div data-testid="page-effects">Effect Page</div> }));
vi.mock('./components/container/LightCardGrid/LightCardGrid', () => ({ default: () => <div data-testid="page-lights">Light Page</div> }));

// Helper to create a real store without routing
const createTestStore = (initialState = {}) => {
    const rootReducer = combineReducers({
        // Mock reducers to return initial state
        nodes: (state = initialState.nodes || {}) => state,
        effects: (state = initialState.effects || { configuredEffects: [] }) => state,
        nodeValues: (state = {}) => state,
        lightValues: (state = {}) => state,
        ui: (state = initialState.ui || { global: { mobileMenuOpen: false } }) => state,
    });

    return createStore(rootReducer);
};

describe('App Routing Integration', () => {

    it('should redirect root / to /nodes', () => {
        const store = createTestStore({});

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        // Expect Nodes page to be visible (due to redirect)
        expect(screen.getByTestId('page-nodes')).toBeInTheDocument();
    });

    it('should render Effects page on /effects', () => {
        const store = createTestStore({});

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/effects']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByTestId('page-effects')).toBeInTheDocument();
    });

    it('should render Lights page on /nodes/:nodeId/lights', () => {
        const store = createTestStore({});

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/nodes/node-1/lights']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByTestId('page-lights')).toBeInTheDocument();
    });
});

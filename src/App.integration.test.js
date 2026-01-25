import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import App from './App';

// Mock container components
jest.mock('./components/container/NodeCardGrid/NodeCardGrid', () => () => <div data-testid="page-nodes">Node Page</div>);
jest.mock('./components/container/EffectCardGrid/EffectCardGrid', () => () => <div data-testid="page-effects">Effect Page</div>);
jest.mock('./components/container/LightCardGrid/LightCardGrid', () => () => <div data-testid="page-lights">Light Page</div>);

// Helper to create a real store with routing support
const createTestStore = (history, initialState = {}) => {
    const rootReducer = combineReducers({
        router: connectRouter(history),
        // Mock other reducers to return initial state
        nodes: (state = initialState.nodes || {}) => state,
        effects: (state = initialState.effects || { configuredEffects: {} }) => state,
        nodeValues: (state = {}) => state,
        lightValues: (state = {}) => state,
    });

    return createStore(
        rootReducer,
        applyMiddleware(routerMiddleware(history))
    );
};

describe('App Routing Integration', () => {

    it('should redirect root / to /nodes', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        const store = createTestStore(history, {});

        render(
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </Provider>
        );

        // Expect Redirect to /nodes
        expect(screen.getByTestId('page-nodes')).toBeInTheDocument();
        expect(history.location.pathname).toBe('/nodes');
    });

    it('should render Effects page on /effects', () => {
        const history = createMemoryHistory({ initialEntries: ['/effects'] });
        const store = createTestStore(history, {});

        render(
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </Provider>
        );

        expect(screen.getByTestId('page-effects')).toBeInTheDocument();
    });

    it('should render Lights page on /nodes/:nodeId/lights', () => {
        const history = createMemoryHistory({ initialEntries: ['/nodes/node-1/lights'] });
        const store = createTestStore(history, {});

        render(
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </Provider>
        );

        expect(screen.getByTestId('page-lights')).toBeInTheDocument();
    });
});

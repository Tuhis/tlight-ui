import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LightCardGrid from './LightCardGrid';
import { vi } from 'vitest';

// Configure mock for child component
vi.mock('../LightCard/LightCard', () => ({
    default: (props) => <div data-testid="light-card" data-id={props.id}>LightCard {props.id}</div>
}));

const mockStore = configureStore([]);

describe('LightCardGrid', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            lightValues: {
                'node-1': {
                    'light-1': {},
                    'light-2': {}
                }
            }
        });
    });

    it('should render LightCards for specific node', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/nodes/node-1']}>
                    <Routes>
                        <Route path="/nodes/:nodeId" element={<LightCardGrid />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const cards = screen.getAllByTestId('light-card');
        expect(cards).toHaveLength(2);
        expect(screen.getByText('LightCard light-1')).toBeInTheDocument();
        expect(screen.getByText('LightCard light-2')).toBeInTheDocument();
    });

    it('should render empty if node has no lights', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/nodes/unknown-node']}>
                    <Routes>
                        <Route path="/nodes/:nodeId" element={<LightCardGrid />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByTestId('light-card')).not.toBeInTheDocument();
    });
});

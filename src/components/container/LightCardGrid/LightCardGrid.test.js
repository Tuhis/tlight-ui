import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LightCardGrid from './LightCardGrid';

jest.mock('../LightCard/LightCard', () => (props) => <div data-testid="light-card" data-id={props.id}>LightCard {props.id}</div>);

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
        // Mocking react-router match prop
        const match = { params: { nodeId: 'node-1' } };

        render(
            <Provider store={store}>
                <LightCardGrid match={match} />
            </Provider>
        );

        const cards = screen.getAllByTestId('light-card');
        expect(cards).toHaveLength(2);
        expect(screen.getByText('LightCard light-1')).toBeInTheDocument();
        expect(screen.getByText('LightCard light-2')).toBeInTheDocument();
    });

    it('should render empty if node has no lights', () => {
        const match = { params: { nodeId: 'unknown-node' } };

        render(
            <Provider store={store}>
                <LightCardGrid match={match} />
            </Provider>
        );

        expect(screen.queryByTestId('light-card')).not.toBeInTheDocument();
    });
});

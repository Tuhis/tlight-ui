import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NodeCardGrid from './NodeCardGrid';

// Mock the child component to avoid deep rendering
jest.mock('../NodeCard/NodeCard', () => (props) => <div data-testid="node-card" data-id={props.id}>NodeCard {props.id}</div>);

const mockStore = configureStore([]);

describe('NodeCardGrid', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            nodes: {
                'node-1': { id: 'node-1', name: 'Node 1' },
                'node-2': { id: 'node-2', name: 'Node 2' }
            }
        });
    });

    it('should calculate nodeIds from state and render NodeCards', () => {
        render(
            <Provider store={store}>
                <NodeCardGrid />
            </Provider>
        );

        // MapStateToProps logic: _.keys(state.nodes) -> ['node-1', 'node-2']
        const cards = screen.getAllByTestId('node-card');
        expect(cards).toHaveLength(2);
        expect(screen.getByText('NodeCard node-1')).toBeInTheDocument();
        expect(screen.getByText('NodeCard node-2')).toBeInTheDocument();
    });

    it('should render empty grid when no nodes', () => {
        store = mockStore({
            nodes: {}
        });

        render(
            <Provider store={store}>
                <NodeCardGrid />
            </Provider>
        );

        expect(screen.queryByTestId('node-card')).not.toBeInTheDocument();
    });
});

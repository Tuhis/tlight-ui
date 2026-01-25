import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    NODES_RECEIVED,
    NODE_RECEIVED,
    NODE_VALUES_CHANGED,
    nodesReceived,
    nodeReceived,
    nodeValuesChanged,
    changeNodeValues,
    loadNodeData
} from './nodeActions';

// Mock API middleware to handle TLIGHT_API actions
const mockApiMiddleware = () => next => action => {
    if (action.type === 'TLIGHT_API') {
        next(action);
        // Return a promise that resolves to mock response
        if (action.payload.action === 'fetchNodeData') {
            return Promise.resolve({
                json: () => Promise.resolve({ nodes: [] })
            });
        }
        return Promise.resolve({ json: () => Promise.resolve({}) });
    }
    return next(action);
};

const middlewares = [thunk, mockApiMiddleware];
const mockStore = configureMockStore(middlewares);

describe('nodeActions', () => {
    describe('Action Creators', () => {
        describe('nodesReceived', () => {
            it('should create action with correct type and payload', () => {
                const nodes = [
                    { id: 'node-1', name: 'Node 1' },
                    { id: 'node-2', name: 'Node 2' }
                ];

                const action = nodesReceived(nodes);

                expect(action).toEqual({
                    type: NODES_RECEIVED,
                    payload: { nodes }
                });
            });
        });

        describe('nodeReceived', () => {
            it('should create action with nodeId and node', () => {
                const nodeId = 'node-1';
                const node = { id: 'node-1', name: 'Test Node' };

                const action = nodeReceived(nodeId, node);

                expect(action).toEqual({
                    type: NODE_RECEIVED,
                    payload: { nodeId, node }
                });
            });
        });

        describe('nodeValuesChanged', () => {
            it('should create action with nodeId and values', () => {
                const nodeId = 'node-1';
                const values = { brightness: 150, mode: 'SINGLE' };

                const action = nodeValuesChanged(nodeId, values);

                expect(action).toEqual({
                    type: NODE_VALUES_CHANGED,
                    payload: { nodeId, values }
                });
            });
        });
    });

    describe('Thunk Actions', () => {
        describe('changeNodeValues', () => {
            it('should dispatch TLIGHT_API action and NODE_VALUES_CHANGED', async () => {
                const nodeId = 'node-1';
                const values = { brightness: 200 };

                const store = mockStore({});
                await store.dispatch(changeNodeValues(nodeId, values));

                const actions = store.getActions();

                expect(actions).toHaveLength(2);
                expect(actions[0]).toEqual({
                    type: 'TLIGHT_API',
                    payload: {
                        action: 'postNodeValuesThrottled',
                        params: { nodeId, values }
                    }
                });
                expect(actions[1]).toEqual({
                    type: NODE_VALUES_CHANGED,
                    payload: { nodeId, values }
                });
            });
        });

        describe('loadNodeData', () => {
            it('should dispatch TLIGHT_API action and NODES_RECEIVED on success', async () => {
                const store = mockStore({});
                await store.dispatch(loadNodeData());

                const actions = store.getActions();

                expect(actions).toHaveLength(2);
                expect(actions[0].type).toBe('TLIGHT_API');
                expect(actions[0].payload.action).toBe('fetchNodeData');
                expect(actions[1].type).toBe(NODES_RECEIVED);
            });
        });
    });
});

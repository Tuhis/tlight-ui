import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    NODES_RECEIVED,
    NODE_VALUES_CHANGED,
    nodesReceived,
    nodeValuesChanged,
    changeNodeValues,
    loadNodeData
} from './nodeActions';
// Note: nodeReceived was removed as it's unused

// Stub middleware to intercept API calls
const mockApiMiddleware = ({ dispatch, getState }) => next => action => {
    if (action.type === 'TLIGHT_API') {
        next(action);
        if (action.payload.action === 'fetchNodeData') {
            return Promise.resolve({
                json: () => Promise.resolve({
                    nodes: [
                        { id: 'node-1', name: 'Node 1', lights: [], state: { mode: 'SINGLE', color: {} } }
                    ]
                })
            });
        }
        return Promise.resolve({ json: () => Promise.resolve({}) });
    }
    return next(action);
};

// Use real store with middlewares to verify integration (better than mockStore for RTK)
// But for existing tests using mockStore, we can keep using it if we import thunk correctly?
// Actually, let's switch to the recorder pattern we used successfully in other tests.
// It's robust and works with RTK.

import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from '../slices/nodesSlice';
import nodeValuesReducer from '../slices/nodeValuesSlice';
import lightValuesReducer from '../slices/lightValuesSlice';
import effectsReducer from '../slices/effectsSlice';

// Action recorder
const createActionRecorder = () => {
    const actions = [];
    const middleware = () => next => action => {
        actions.push(action);
        return next(action);
    };
    return { middleware, actions };
};

describe('nodeActions', () => {
    describe('Action Creators', () => {
        describe('nodesReceived', () => {
            it('should create action with correct type and payload', () => {
                const nodes = [
                    { id: 'node-1', name: 'Node 1' },
                    { id: 'node-2', name: 'Node 2' }
                ];
                const action = nodesReceived({ nodes });
                // RTK action payload match
                expect(action.payload).toEqual({ nodes });
                expect(action.type).toMatch(/nodesReceived/);
            });
        });

        describe('nodeValuesChanged', () => {
            it('should create action with nodeId and values', () => {
                const nodeId = 'node-1';
                const values = { brightness: 150, mode: 'SINGLE' };
                const action = nodeValuesChanged({ nodeId, values });

                expect(action.payload).toEqual({ nodeId, values });
                expect(action.type).toMatch(/nodeValuesChanged/);
            });
        });
    });

    describe('Thunk Actions', () => {
        let store;
        let recordedActions;

        beforeEach(() => {
            const recorder = createActionRecorder();
            recordedActions = recorder.actions;

            store = configureStore({
                reducer: {
                    nodes: nodesReducer,
                    nodeValues: nodeValuesReducer,
                    lightValues: lightValuesReducer,
                    effects: effectsReducer
                },
                middleware: (getDefaultMiddleware) =>
                    getDefaultMiddleware()
                        .concat(mockApiMiddleware)
                        .concat(recorder.middleware)
            });
        });

        describe('changeNodeValues', () => {
            it('should dispatch TLIGHT_API action and NODE_VALUES_CHANGED', async () => {
                const nodeId = 'node-1';
                const values = { brightness: 200 };

                await store.dispatch(changeNodeValues(nodeId, values));

                const dispatchedTypes = recordedActions.map(a => a.type);
                expect(dispatchedTypes).toContain('TLIGHT_API');
                expect(dispatchedTypes.some(t => t.match(/nodeValuesChanged/))).toBe(true);

                const apiAction = recordedActions.find(a => a.type === 'TLIGHT_API');
                expect(apiAction.payload.params).toEqual({ nodeId, values });
            });
        });

        describe('loadNodeData', () => {
            it('should dispatch TLIGHT_API action and NODES_RECEIVED on success', async () => {
                await store.dispatch(loadNodeData());

                const dispatchedTypes = recordedActions.map(a => a.type);
                expect(dispatchedTypes).toContain('TLIGHT_API');
                expect(dispatchedTypes.some(t => t.match(/nodesReceived/))).toBe(true);
            });
        });
    });
});

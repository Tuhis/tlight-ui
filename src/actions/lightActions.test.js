import { configureStore } from '@reduxjs/toolkit';
import {
    LIGHT_VALUES_CHANGED,
    lightValuesChanged,
    changeLightValues
} from './lightActions';
import lightValuesReducer from '../slices/lightValuesSlice';

// Stub middleware to intercept API calls
const mockApiMiddleware = ({ dispatch, getState }) => next => action => {
    if (action.type === 'TLIGHT_API') {
        next(action); // Let it pass to recorder
        return Promise.resolve({ json: () => Promise.resolve({}) });
    }
    return next(action);
};

// Middleware to record actions
const createActionRecorder = () => {
    const actions = [];
    const middleware = () => next => action => {
        actions.push(action);
        return next(action);
    };
    return { middleware, actions };
};

describe('lightActions', () => {
    describe('Action Creators', () => {
        // ... pure action creator tests (no changes needed for these, but I'll include them)
        describe('lightValuesChanged', () => {
            it('should create action with nodeId, lightId, and values', () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { brightness: 150, red: 255 };
                const action = lightValuesChanged({ nodeId, lightId, values });
                expect(action).toEqual({
                    type: LIGHT_VALUES_CHANGED,
                    payload: { nodeId, lightId, values }
                });
            });

            it('should handle color values', () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { red: 255, green: 128, blue: 0 };
                const action = lightValuesChanged({ nodeId, lightId, values });
                expect(action.payload.values).toEqual(values);
            });

            it('should handle brightness only', () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { brightness: 200 };
                const action = lightValuesChanged({ nodeId, lightId, values });
                expect(action.payload.values).toEqual({ brightness: 200 });
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
                    lightValues: lightValuesReducer
                },
                middleware: (getDefaultMiddleware) =>
                    getDefaultMiddleware()
                        .concat(mockApiMiddleware)
                        .concat(recorder.middleware)
            });
        });

        describe('changeLightValues', () => {
            it('should dispatch TLIGHT_API action and LIGHT_VALUES_CHANGED', async () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { brightness: 180 };

                await store.dispatch(changeLightValues(nodeId, lightId, values));

                // Filter out internal RTK actions if any (though unlikely here)
                // Actually, check specifically for our expected actions
                const dispatchedTypes = recordedActions.map(a => a.type);

                expect(dispatchedTypes).toContain('TLIGHT_API');
                expect(dispatchedTypes).toContain(LIGHT_VALUES_CHANGED);

                const apiAction = recordedActions.find(a => a.type === 'TLIGHT_API');
                expect(apiAction).toEqual({
                    type: 'TLIGHT_API',
                    payload: {
                        action: 'postLightValuesThrottled',
                        params: { nodeId, lightId, values }
                    }
                });

                const changeAction = recordedActions.find(a => a.type === LIGHT_VALUES_CHANGED);
                expect(changeAction).toEqual({
                    type: LIGHT_VALUES_CHANGED,
                    payload: { nodeId, lightId, values }
                });
            });

            it('should handle RGB color changes', async () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-2';
                const values = { red: 0, green: 255, blue: 128 };

                await store.dispatch(changeLightValues(nodeId, lightId, values));

                const apiAction = recordedActions.find(a => a.type === 'TLIGHT_API');
                const changeAction = recordedActions.find(a => a.type === LIGHT_VALUES_CHANGED);

                expect(apiAction.payload.params.values).toEqual(values);
                expect(changeAction.payload.values).toEqual(values);
            });

            it('should handle combined brightness and color', async () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-3';
                const values = { brightness: 200, red: 255, green: 0, blue: 0 };

                await store.dispatch(changeLightValues(nodeId, lightId, values));
                const changeAction = recordedActions.find(a => a.type === LIGHT_VALUES_CHANGED);
                expect(changeAction.payload.values).toEqual(values);
            });
        });
    });
});

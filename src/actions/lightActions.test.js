import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    LIGHT_VALUES_CHANGED,
    lightValuesChanged,
    changeLightValues
} from './lightActions';

// Mock API middleware
const mockApiMiddleware = () => next => action => {
    if (action.type === 'TLIGHT_API') {
        next(action);
        return Promise.resolve({ json: () => Promise.resolve({}) });
    }
    return next(action);
};

const middlewares = [thunk, mockApiMiddleware];
const mockStore = configureMockStore(middlewares);

describe('lightActions', () => {
    describe('Action Creators', () => {
        describe('lightValuesChanged', () => {
            it('should create action with nodeId, lightId, and values', () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { brightness: 150, red: 255 };

                const action = lightValuesChanged(nodeId, lightId, values);

                expect(action).toEqual({
                    type: LIGHT_VALUES_CHANGED,
                    payload: { nodeId, lightId, values }
                });
            });

            it('should handle color values', () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { red: 255, green: 128, blue: 0 };

                const action = lightValuesChanged(nodeId, lightId, values);

                expect(action.payload.values).toEqual(values);
            });

            it('should handle brightness only', () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { brightness: 200 };

                const action = lightValuesChanged(nodeId, lightId, values);

                expect(action.payload.values).toEqual({ brightness: 200 });
            });
        });
    });

    describe('Thunk Actions', () => {
        describe('changeLightValues', () => {
            it('should dispatch TLIGHT_API action and LIGHT_VALUES_CHANGED', async () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-1';
                const values = { brightness: 180 };

                const store = mockStore({});
                await store.dispatch(changeLightValues(nodeId, lightId, values));

                const actions = store.getActions();

                expect(actions).toHaveLength(2);
                expect(actions[0]).toEqual({
                    type: 'TLIGHT_API',
                    payload: {
                        action: 'postLightValuesThrottled',
                        params: { nodeId, lightId, values }
                    }
                });
                expect(actions[1]).toEqual({
                    type: LIGHT_VALUES_CHANGED,
                    payload: { nodeId, lightId, values }
                });
            });

            it('should handle RGB color changes', async () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-2';
                const values = { red: 0, green: 255, blue: 128 };

                const store = mockStore({});
                await store.dispatch(changeLightValues(nodeId, lightId, values));

                const actions = store.getActions();

                expect(actions[0].payload.params.values).toEqual(values);
                expect(actions[1].payload.values).toEqual(values);
            });

            it('should handle combined brightness and color', async () => {
                const nodeId = 'node-1';
                const lightId = 'node-1-light-3';
                const values = { brightness: 200, red: 255, green: 0, blue: 0 };

                const store = mockStore({});
                await store.dispatch(changeLightValues(nodeId, lightId, values));

                const actions = store.getActions();

                expect(actions[1].payload.values).toEqual(values);
            });
        });
    });
});

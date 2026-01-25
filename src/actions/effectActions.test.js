import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    CREATE_NEW_EFFECT,
    SET_EFFECT_NAME,
    SET_EFFECT_TYPE,
    SET_EFFECT_PROPERTY,
    SELECT_EFFECT,
    DELETE_EFFECT,
    createNewEffect,
    selectEffectAC,
    setEffectName,
    setEffectType,
    setEffectProperty,
    deleteEffect,
    selectEffect
} from './effectActions';

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

describe('effectActions', () => {
    describe('Action Creators', () => {
        describe('createNewEffect', () => {
            it('should create action with correct type', () => {
                const action = createNewEffect();
                expect(action).toEqual({ type: CREATE_NEW_EFFECT });
            });
        });

        describe('selectEffectAC', () => {
            it('should create action with nodeId and effectId', () => {
                const nodeId = 'node-1';
                const effectId = 'effect-1';

                const action = selectEffectAC(nodeId, effectId);

                expect(action).toEqual({
                    type: SELECT_EFFECT,
                    payload: { nodeId, effectId }
                });
            });
        });

        describe('setEffectName', () => {
            it('should create action with effectId and name', () => {
                const id = 'effect-1';
                const name = 'My Effect';

                const action = setEffectName(id, name);

                expect(action).toEqual({
                    type: SET_EFFECT_NAME,
                    payload: { effectId: id, name }
                });
            });
        });

        describe('setEffectType', () => {
            it('should create action with effectId and type', () => {
                const id = 'effect-1';
                const type = 'rainbow';

                const action = setEffectType(id, type);

                expect(action).toEqual({
                    type: SET_EFFECT_TYPE,
                    payload: { effectId: id, type }
                });
            });
        });

        describe('setEffectProperty', () => {
            it('should create action with effectId, path, and value', () => {
                const id = 'effect-1';
                const path = 'speed';
                const value = 10;

                const action = setEffectProperty(id, path, value);

                expect(action).toEqual({
                    type: SET_EFFECT_PROPERTY,
                    payload: { effectId: id, path, value }
                });
            });

            it('should handle nested path', () => {
                const id = 'effect-1';
                const path = 'color.red';
                const value = 255;

                const action = setEffectProperty(id, path, value);

                expect(action.payload.path).toBe('color.red');
                expect(action.payload.value).toBe(255);
            });
        });

        describe('deleteEffect', () => {
            it('should create action with effectId', () => {
                const id = 'effect-1';

                const action = deleteEffect(id);

                expect(action).toEqual({
                    type: DELETE_EFFECT,
                    payload: { effectId: id }
                });
            });
        });
    });

    describe('Thunk Actions', () => {
        describe('selectEffect', () => {
            it('should dispatch TLIGHT_API action and SELECT_EFFECT', async () => {
                const nodeId = 'node-1';
                const effectId = 'effect-1';

                const initialState = {
                    effects: {
                        configuredEffects: [
                            {
                                id: 'effect-1',
                                type: 'rainbow',
                                effectProperties: {
                                    effect: {
                                        name: 'rainbow',
                                        lightCount: 5
                                    }
                                }
                            }
                        ]
                    }
                };

                const store = mockStore(initialState);
                await store.dispatch(selectEffect(nodeId, effectId));

                const actions = store.getActions();

                expect(actions).toHaveLength(2);
                expect(actions[0].type).toBe('TLIGHT_API');
                expect(actions[0].payload.action).toBe('postEffectSetup');
                expect(actions[0].payload.params.nodeId).toBe(nodeId);
                expect(actions[1]).toEqual({
                    type: SELECT_EFFECT,
                    payload: { nodeId, effectId }
                });
            });

            it('should handle color parameter', async () => {
                const nodeId = 'node-1';
                const effectId = 'effect-1';
                const color = { red: 255, green: 0, blue: 0 };

                const initialState = {
                    effects: {
                        configuredEffects: [
                            {
                                id: 'effect-1',
                                type: 'pulse',
                                effectProperties: {
                                    effect: {
                                        name: 'pulse'
                                    }
                                }
                            }
                        ]
                    }
                };

                const store = mockStore(initialState);
                await store.dispatch(selectEffect(nodeId, effectId, color));

                const actions = store.getActions();
                expect(actions[0].payload.params.body.colors).toEqual(color);
            });
        });
    });
});

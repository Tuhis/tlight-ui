import { configureStore } from '@reduxjs/toolkit';
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
import effectsReducer from '../slices/effectsSlice';

// Stub middleware to intercept API calls
const mockApiMiddleware = ({ dispatch, getState }) => next => action => {
    if (action.type === 'TLIGHT_API') {
        next(action);
        return Promise.resolve({ json: () => Promise.resolve({}) });
    }
    return next(action);
};

// Action recorder
const createActionRecorder = () => {
    const actions = [];
    const middleware = () => next => action => {
        actions.push(action);
        return next(action);
    };
    return { middleware, actions };
};

describe('effectActions', () => {
    describe('Action Creators', () => {
        it('should create action to add new effect', () => {
            const action = createNewEffect();
            // In RTK slice, action type is auto-generated
            expect(action.type).toMatch(/effects\/effectCreated/);
        });

        it('should create action to select effect', () => {
            const nodeId = 'node-1';
            const effectId = 'effect-1';
            const action = selectEffectAC(nodeId, effectId);
            expect(action.payload).toEqual({ nodeId, effectId });
        });

        it('should create action to set effect name', () => {
            const id = 'effect-1';
            const name = 'New Effect';
            const action = setEffectName(id, name);
            expect(action.payload).toEqual({ effectId: id, name });
        });

        it('should create action to set effect type', () => {
            const id = 'effect-1';
            const type = 'rainbow';
            const action = setEffectType(id, type);
            expect(action.payload).toEqual({ effectId: id, type });
        });

        it('should create action to set effect property', () => {
            const id = 'effect-1';
            const path = 'speed';
            const value = 100;
            const action = setEffectProperty(id, path, value);
            expect(action.payload).toEqual({ effectId: id, path, value });
        });

        it('should create action to delete effect', () => {
            const id = 'effect-1';
            const action = deleteEffect(id);
            expect(action.payload).toEqual({ effectId: id });
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
                    effects: effectsReducer
                },
                middleware: (getDefaultMiddleware) =>
                    getDefaultMiddleware()
                        .concat(mockApiMiddleware)
                        .concat(recorder.middleware)
            });
        });

        describe('selectEffect', () => {
            it('should dispatch TLIGHT_API action and SELECT_EFFECT', async () => {
                const nodeId = 'node-1';
                const effectId = 'effect-1';

                // Preload store with an effect
                // Need to use slice actions to set up state
                // Since we don't have direct access to set state easily without another action,
                // we'll just mock the state needed by selectEffect thunk.
                // Actually, selectEffect uses getState().effects.configuredEffects.

                // We can use preloadedState in configureStore!
                const preloadedStore = configureStore({
                    reducer: { effects: effectsReducer },
                    middleware: (gDM) => gDM().concat(mockApiMiddleware).concat(createActionRecorder().middleware),
                    preloadedState: {
                        effects: {
                            configuredEffects: [{
                                id: effectId,
                                type: 'rainbow',
                                effectProperties: {
                                    effect: {
                                        pluginOpts: {
                                            effectOpts: {
                                                startColor: { red: 0, green: 0, blue: 0 },
                                                endColor: { red: 255, green: 255, blue: 255 }
                                            }
                                        }
                                    }
                                }
                            }],
                            effectsInUsePerNode: {}
                        }
                    }
                });

                // Re-attach recorder to this new store
                const recorder = createActionRecorder();
                recordedActions = recorder.actions; // Update reference
                // Wait, I can't easily re-attach middleware to existing store.
                // Let's just recreate the store properly in the test.

                store = configureStore({
                    reducer: { effects: effectsReducer },
                    middleware: (gDM) => gDM().concat(mockApiMiddleware).concat(recorder.middleware),
                    preloadedState: {
                        effects: {
                            configuredEffects: [{
                                id: effectId,
                                type: 'rainbow',
                                effectProperties: {
                                    effect: {
                                        pluginOpts: {
                                            effectOpts: {
                                                startColor: { red: 0, green: 0, blue: 0 },
                                                endColor: { red: 255, green: 255, blue: 255 }
                                            }
                                        }
                                    }
                                }
                            }],
                            effectsInUsePerNode: {}
                        }
                    }
                });

                await store.dispatch(selectEffect(nodeId, effectId));

                const dispatchedTypes = recordedActions.map(a => a.type);
                expect(dispatchedTypes).toContain('TLIGHT_API');
                // Check matching against slice action type regex or known prefix
                expect(dispatchedTypes.some(t => t.match(/effects\/effectSelected/))).toBe(true);
            });
        });
    });
});

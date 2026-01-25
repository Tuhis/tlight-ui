import effectsReducer, { effectsInitializedForNodes } from './effectsSlice';
import {
    CREATE_NEW_EFFECT,
    SET_EFFECT_NAME,
    SET_EFFECT_TYPE,
    SET_EFFECT_PROPERTY,
    SELECT_EFFECT,
    DELETE_EFFECT
} from '../actions/effectActions';

describe('effects reducer', () => {
    const initialState = {
        configuredEffects: [],
        effectsInUsePerNode: {}
    };

    it('should return initial state when state is undefined', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const result = effectsReducer(undefined, action);
        expect(result).toEqual(initialState);
    });

    describe('effectsInitializedForNodes', () => {
        it('should create effectsInUsePerNode structure from nodes', () => {
            const mockNodes = [
                { id: 'node-1', name: 'Node 1' },
                { id: 'node-2', name: 'Node 2' }
            ];

            const action = effectsInitializedForNodes({ nodes: mockNodes });

            const result = effectsReducer(undefined, action);

            expect(result.effectsInUsePerNode).toEqual({
                'node-1': {
                    nodeId: 'node-1',
                    nodeName: 'Node 1',
                    effectId: null
                },
                'node-2': {
                    nodeId: 'node-2',
                    nodeName: 'Node 2',
                    effectId: null
                }
            });
        });

        it('should preserve configuredEffects when processing nodes', () => {
            const state = {
                configuredEffects: [{ id: 'effect-1', name: 'Test Effect' }],
                effectsInUsePerNode: {}
            };

            const action = effectsInitializedForNodes({ nodes: [{ id: 'node-1', name: 'Node 1' }] });
            const result = effectsReducer(state, action);

            expect(result.configuredEffects).toEqual(state.configuredEffects);
        });
    });

    describe('CREATE_NEW_EFFECT', () => {
        it('should add a new effect to configuredEffects', () => {
            const action = { type: CREATE_NEW_EFFECT };
            const result = effectsReducer(initialState, action);

            expect(result.configuredEffects).toHaveLength(1);
            expect(result.configuredEffects[0]).toMatchObject({
                name: 'Effect Name',
                type: null,
                effectProperties: {}
            });
            expect(result.configuredEffects[0].id).toBeDefined();
        });

        it('should append to existing effects', () => {
            const state = {
                ...initialState,
                configuredEffects: [{ id: 'existing-1', name: 'Existing' }]
            };

            const action = { type: CREATE_NEW_EFFECT };
            const result = effectsReducer(state, action);

            expect(result.configuredEffects).toHaveLength(2);
            expect(result.configuredEffects[0].id).toBe('existing-1');
        });
    });

    describe('SELECT_EFFECT', () => {
        it('should update effectId for a specific node', () => {
            const state = {
                ...initialState,
                effectsInUsePerNode: {
                    'node-1': { nodeId: 'node-1', nodeName: 'Node 1', effectId: null },
                    'node-2': { nodeId: 'node-2', nodeName: 'Node 2', effectId: null }
                }
            };

            const action = {
                type: SELECT_EFFECT,
                payload: { nodeId: 'node-1', effectId: 'effect-123' }
            };

            const result = effectsReducer(state, action);

            expect(result.effectsInUsePerNode['node-1'].effectId).toBe('effect-123');
            expect(result.effectsInUsePerNode['node-2'].effectId).toBeNull();
        });

        it('should preserve other node properties', () => {
            const state = {
                ...initialState,
                effectsInUsePerNode: {
                    'node-1': { nodeId: 'node-1', nodeName: 'Test Node', effectId: null }
                }
            };

            const action = {
                type: SELECT_EFFECT,
                payload: { nodeId: 'node-1', effectId: 'effect-456' }
            };

            const result = effectsReducer(state, action);

            expect(result.effectsInUsePerNode['node-1']).toEqual({
                nodeId: 'node-1',
                nodeName: 'Test Node',
                effectId: 'effect-456'
            });
        });
    });

    describe('DELETE_EFFECT', () => {
        it('should remove effect from configuredEffects', () => {
            const state = {
                ...initialState,
                configuredEffects: [
                    { id: 'effect-1', name: 'Effect 1' },
                    { id: 'effect-2', name: 'Effect 2' },
                    { id: 'effect-3', name: 'Effect 3' }
                ]
            };

            const action = {
                type: DELETE_EFFECT,
                payload: { effectId: 'effect-2' }
            };

            const result = effectsReducer(state, action);

            expect(result.configuredEffects).toHaveLength(2);
            expect(result.configuredEffects).toEqual([
                { id: 'effect-1', name: 'Effect 1' },
                { id: 'effect-3', name: 'Effect 3' }
            ]);
        });
    });

    describe('SET_EFFECT_NAME', () => {
        it('should update name of specific effect', () => {
            const state = {
                ...initialState,
                configuredEffects: [
                    { id: 'effect-1', name: 'Old Name', type: 'rainbow' },
                    { id: 'effect-2', name: 'Other Effect', type: 'pulse' }
                ]
            };

            const action = {
                type: SET_EFFECT_NAME,
                payload: { effectId: 'effect-1', name: 'New Name' }
            };

            const result = effectsReducer(state, action);

            expect(result.configuredEffects[0].name).toBe('New Name');
            expect(result.configuredEffects[1].name).toBe('Other Effect');
        });
    });

    describe('SET_EFFECT_TYPE', () => {
        it('should update type and reset effectProperties', () => {
            const state = {
                ...initialState,
                configuredEffects: [
                    {
                        id: 'effect-1',
                        name: 'My Effect',
                        type: 'rainbow',
                        effectProperties: { speed: 10, color: 'red' }
                    }
                ]
            };

            const action = {
                type: SET_EFFECT_TYPE,
                payload: { effectId: 'effect-1', type: 'pulse' }
            };

            const result = effectsReducer(state, action);

            expect(result.configuredEffects[0]).toEqual({
                id: 'effect-1',
                name: 'My Effect',
                type: 'pulse',
                effectProperties: {}
            });
        });
    });

    describe('SET_EFFECT_PROPERTY', () => {
        it('should set a simple property value', () => {
            const state = {
                ...initialState,
                configuredEffects: [
                    { id: 'effect-1', name: 'Effect', type: 'rainbow', effectProperties: {} }
                ]
            };

            const action = {
                type: SET_EFFECT_PROPERTY,
                payload: { effectId: 'effect-1', path: 'speed', value: 15 }
            };

            const result = effectsReducer(state, action);

            expect(result.configuredEffects[0].effectProperties.speed).toBe(15);
        });

        it('should set nested property value', () => {
            const state = {
                ...initialState,
                configuredEffects: [
                    { id: 'effect-1', name: 'Effect', type: 'rainbow', effectProperties: {} }
                ]
            };

            const action = {
                type: SET_EFFECT_PROPERTY,
                payload: { effectId: 'effect-1', path: 'color.red', value: 255 }
            };

            const result = effectsReducer(state, action);

            expect(result.configuredEffects[0].effectProperties.color.red).toBe(255);
        });
    });
});

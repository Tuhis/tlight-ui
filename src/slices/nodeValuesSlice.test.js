import nodeValuesReducer, { nodeValuesInitialized, nodeValuesChanged } from './nodeValuesSlice';

describe('nodeValues reducer', () => {
    it('should return initial state when state is undefined', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const result = nodeValuesReducer(undefined, action);
        expect(result).toEqual({});
    });

    describe('nodeValuesInitialized', () => {
        it('should extract node values from nodes', () => {
            const mockNodes = [
                {
                    id: 'node-1',
                    name: 'Node 1',
                    state: {
                        mode: 'SINGLE',
                        brightness: 200,
                        color: { red: 255, green: 128, blue: 0 }
                    }
                },
                {
                    id: 'node-2',
                    name: 'Node 2',
                    state: {
                        mode: 'EXTERNAL',
                        brightness: 150
                    }
                }
            ];

            const action = nodeValuesInitialized({ nodes: mockNodes });
            const result = nodeValuesReducer(undefined, action);

            expect(result).toEqual({
                'node-1': {
                    id: 'node-1',
                    mode: 'SINGLE',
                    brightness: 200,
                    red: 255,
                    green: 128,
                    blue: 0
                },
                'node-2': {
                    id: 'node-2',
                    mode: 'EXTERNAL',
                    brightness: 150,
                    red: undefined,
                    green: undefined,
                    blue: undefined
                }
            });
        });

        it('should handle nodes without color', () => {
            const mockNodes = [
                {
                    id: 'node-1',
                    name: 'DMX Node',
                    state: {
                        mode: 'EXTERNAL'
                    }
                }
            ];

            const action = nodeValuesInitialized({ nodes: mockNodes });
            const result = nodeValuesReducer(undefined, action);

            expect(result['node-1']).toMatchObject({
                id: 'node-1',
                mode: 'EXTERNAL'
            });
        });
    });

    describe('nodeValuesChanged', () => {
        it('should update values for specific node', () => {
            const initialState = {
                'node-1': {
                    id: 'node-1',
                    mode: 'SINGLE',
                    brightness: 100,
                    red: 255,
                    green: 0,
                    blue: 0
                }
            };

            const action = nodeValuesChanged({
                nodeId: 'node-1',
                values: { brightness: 200, green: 128 }
            });

            const result = nodeValuesReducer(initialState, action);

            expect(result['node-1']).toEqual({
                id: 'node-1',
                mode: 'SINGLE',
                brightness: 200,
                red: 255,
                green: 128,
                blue: 0
            });
        });

        it('should create entry if node does not exist', () => {
            const initialState = {};

            const action = nodeValuesChanged({
                nodeId: 'new-node',
                values: { brightness: 150, mode: 'SINGLE' }
            });

            const result = nodeValuesReducer(initialState, action);

            expect(result['new-node']).toEqual({
                brightness: 150,
                mode: 'SINGLE'
            });
        });

        it('should not affect other nodes', () => {
            const initialState = {
                'node-1': { id: 'node-1', brightness: 100 },
                'node-2': { id: 'node-2', brightness: 200 }
            };

            const action = nodeValuesChanged({
                nodeId: 'node-1',
                values: { brightness: 150 }
            });

            const result = nodeValuesReducer(initialState, action);

            expect(result['node-1'].brightness).toBe(150);
            expect(result['node-2'].brightness).toBe(200);
        });

        it('should handle partial updates', () => {
            const initialState = {
                'node-1': {
                    id: 'node-1',
                    mode: 'SINGLE',
                    brightness: 100,
                    red: 255,
                    green: 255,
                    blue: 255
                }
            };

            const action = nodeValuesChanged({
                nodeId: 'node-1',
                values: { mode: 'EXTERNAL' }
            });

            const result = nodeValuesReducer(initialState, action);

            expect(result['node-1']).toEqual({
                id: 'node-1',
                mode: 'EXTERNAL',
                brightness: 100,
                red: 255,
                green: 255,
                blue: 255
            });
        });
    });
});

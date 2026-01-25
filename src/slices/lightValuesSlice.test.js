import lightValuesReducer, { lightValuesInitialized, lightValuesChanged } from './lightValuesSlice';

describe('lightValues reducer', () => {
    it('should return initial state when state is undefined', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const result = lightValuesReducer(undefined, action);
        expect(result).toEqual({});
    });

    describe('lightValuesInitialized', () => {
        it('should extract light values from nodes', () => {
            const mockNodes = [
                {
                    id: 'node-1',
                    name: 'Node 1',
                    lights: [
                        {
                            id: 'light-1',
                            type: 'rgb',
                            brightness: 200,
                            color: { red: 255, green: 0, blue: 0 }
                        },
                        {
                            id: 'light-2',
                            type: 'rgb',
                            brightness: 150,
                            color: { red: 0, green: 255, blue: 0 }
                        }
                    ]
                }
            ];

            const action = lightValuesInitialized({ nodes: mockNodes });
            const result = lightValuesReducer(undefined, action);

            expect(result['node-1']['node-1-light-1']).toEqual({
                id: 'node-1-light-1',
                type: 'rgb',
                brightness: 200,
                red: 255,
                green: 0,
                blue: 0
            });

            expect(result['node-1']['node-1-light-2']).toEqual({
                id: 'node-1-light-2',
                type: 'rgb',
                brightness: 150,
                red: 0,
                green: 255,
                blue: 0
            });
        });

        it('should handle nodes without lights', () => {
            const mockNodes = [
                {
                    id: 'node-1',
                    name: 'Node without lights',
                    lights: []
                }
            ];

            const action = lightValuesInitialized({ nodes: mockNodes });
            const result = lightValuesReducer(undefined, action);

            expect(result).toBeDefined();
        });

        it('should handle lights without color', () => {
            const mockNodes = [
                {
                    id: 'node-1',
                    name: 'Node 1',
                    lights: [
                        {
                            id: 'light-1',
                            type: 'dimmer',
                            brightness: 180
                        }
                    ]
                }
            ];

            const action = lightValuesInitialized({ nodes: mockNodes });
            const result = lightValuesReducer(undefined, action);

            expect(result['node-1']['node-1-light-1']).toMatchObject({
                id: 'node-1-light-1',
                type: 'dimmer',
                brightness: 180
            });
        });
    });

    describe('lightValuesChanged', () => {
        it('should update values for specific light', () => {
            const initialState = {
                'node-1': {
                    'node-1-light-1': {
                        id: 'node-1-light-1',
                        type: 'rgb',
                        brightness: 100,
                        red: 255,
                        green: 0,
                        blue: 0
                    }
                }
            };

            const action = lightValuesChanged({
                nodeId: 'node-1',
                lightId: 'node-1-light-1',
                values: { brightness: 200, green: 128 }
            });

            const result = lightValuesReducer(initialState, action);

            expect(result['node-1']['node-1-light-1']).toEqual({
                id: 'node-1-light-1',
                type: 'rgb',
                brightness: 200,
                red: 255,
                green: 128,
                blue: 0
            });
        });

        it('should create entry if light does not exist', () => {
            const initialState = {};

            const action = lightValuesChanged({
                nodeId: 'node-1',
                lightId: 'node-1-light-1',
                values: { brightness: 150, red: 255 }
            });

            const result = lightValuesReducer(initialState, action);

            expect(result['node-1']['node-1-light-1']).toEqual({
                brightness: 150,
                red: 255
            });
        });

        it('should not affect other lights in same node', () => {
            const initialState = {
                'node-1': {
                    'node-1-light-1': { brightness: 100 },
                    'node-1-light-2': { brightness: 200 }
                }
            };

            const action = lightValuesChanged({
                nodeId: 'node-1',
                lightId: 'node-1-light-1',
                values: { brightness: 150 }
            });

            const result = lightValuesReducer(initialState, action);

            expect(result['node-1']['node-1-light-1'].brightness).toBe(150);
            expect(result['node-1']['node-1-light-2'].brightness).toBe(200);
        });

        it('should not affect lights in other nodes', () => {
            const initialState = {
                'node-1': {
                    'node-1-light-1': { brightness: 100 }
                },
                'node-2': {
                    'node-2-light-1': { brightness: 200 }
                }
            };

            const action = lightValuesChanged({
                nodeId: 'node-1',
                lightId: 'node-1-light-1',
                values: { brightness: 150 }
            });

            const result = lightValuesReducer(initialState, action);

            expect(result['node-1']['node-1-light-1'].brightness).toBe(150);
            expect(result['node-2']['node-2-light-1'].brightness).toBe(200);
        });

        it('should handle partial updates', () => {
            const initialState = {
                'node-1': {
                    'node-1-light-1': {
                        type: 'rgb',
                        brightness: 100,
                        red: 255,
                        green: 255,
                        blue: 255
                    }
                }
            };

            const action = lightValuesChanged({
                nodeId: 'node-1',
                lightId: 'node-1-light-1',
                values: { red: 128 }
            });

            const result = lightValuesReducer(initialState, action);

            expect(result['node-1']['node-1-light-1']).toEqual({
                type: 'rgb',
                brightness: 100,
                red: 128,
                green: 255,
                blue: 255
            });
        });
    });
});

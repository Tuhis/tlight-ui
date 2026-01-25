import nodesReducer, { nodesReceived } from './nodesSlice';

describe('nodes reducer', () => {
    it('should return initial state when state is undefined', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const result = nodesReducer(undefined, action);
        expect(result).toEqual({});
    });

    it('should handle nodesReceived action', () => {
        const mockNodes = [
            {
                id: 'node-1',
                name: 'Test Node 1',
                type: 'ledstrip',
                state: { mode: 'SINGLE', brightness: 100 }
            },
            {
                id: 'node-2',
                name: 'Test Node 2',
                type: 'dmx',
                state: { mode: 'EXTERNAL' }
            }
        ];

        const action = nodesReceived({ nodes: mockNodes });
        const result = nodesReducer(undefined, action);

        expect(result).toEqual({
            'node-1': mockNodes[0],
            'node-2': mockNodes[1]
        });
    });

    it('should merge new nodes with existing state', () => {
        const initialState = {
            'node-1': {
                id: 'node-1',
                name: 'Existing Node',
                type: 'ledstrip'
            }
        };

        const newNodes = [
            {
                id: 'node-2',
                name: 'New Node',
                type: 'dmx'
            }
        ];

        const action = nodesReceived({ nodes: newNodes });
        const result = nodesReducer(initialState, action);

        expect(result).toEqual({
            'node-1': initialState['node-1'],
            'node-2': newNodes[0]
        });
    });

    it('should handle duplicate node IDs by overwriting', () => {
        const initialState = {
            'node-1': {
                id: 'node-1',
                name: 'Old Name',
                type: 'ledstrip'
            }
        };

        const updatedNodes = [
            {
                id: 'node-1',
                name: 'New Name',
                type: 'ledstrip'
            }
        ];

        const action = nodesReceived({ nodes: updatedNodes });
        const result = nodesReducer(initialState, action);

        expect(result['node-1'].name).toBe('New Name');
    });

    it('should handle empty nodes array', () => {
        const action = nodesReceived({ nodes: [] });
        const result = nodesReducer(undefined, action);

        expect(result).toEqual({});
    });
});

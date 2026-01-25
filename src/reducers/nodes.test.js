import nodes from './nodes';
import { NODES_RECEIVED } from '../actions/nodeActions';

describe('nodes reducer', () => {
    it('should return initial state when state is undefined', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const result = nodes(undefined, action);
        expect(result).toEqual({});
    });

    it('should handle NODES_RECEIVED action', () => {
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

        const action = {
            type: NODES_RECEIVED,
            payload: { nodes: mockNodes }
        };

        const result = nodes(undefined, action);

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

        const action = {
            type: NODES_RECEIVED,
            payload: { nodes: newNodes }
        };

        const result = nodes(initialState, action);

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

        const action = {
            type: NODES_RECEIVED,
            payload: { nodes: updatedNodes }
        };

        const result = nodes(initialState, action);

        expect(result['node-1'].name).toBe('New Name');
    });

    it('should handle empty nodes array', () => {
        const action = {
            type: NODES_RECEIVED,
            payload: { nodes: [] }
        };

        const result = nodes(undefined, action);

        expect(result).toEqual({});
    });
});

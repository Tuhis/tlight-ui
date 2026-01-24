
import { createTlightApiMiddleware } from './tlightApiMiddleware';

describe('tlightApiMiddleware', () => {
    let originalFetch;
    let mockFetch;

    beforeEach(() => {
        originalFetch = global.fetch;
        mockFetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({})
        }));
        global.fetch = mockFetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    const createMiddleware = () => {
        const store = {
            getState: jest.fn(),
            dispatch: jest.fn()
        };
        const next = jest.fn();
        const middleware = createTlightApiMiddleware({ baseUrl: 'http://test-api' })(store)(next);
        return { middleware, next };
    };

    it('should use /lights/nodes for postNodeValues', () => {
        const { middleware } = createMiddleware();
        const action = {
            type: 'TLIGHT_API',
            payload: {
                action: 'postNodeValues',
                params: {
                    nodeId: 'node-1',
                    values: { brightness: 100 }
                }
            }
        };

        middleware(action);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const url = mockFetch.mock.calls[0][0];
        expect(url).toContain('/lights/nodes/node-1');
    });

    it('should use /lights/nodes for postLightValues', () => {
        const { middleware } = createMiddleware();
        const action = {
            type: 'TLIGHT_API',
            payload: {
                action: 'postLightValues',
                params: {
                    nodeId: 'node-1',
                    lightId: 'node-1-light-1',
                    values: { red: 255 }
                }
            }
        };

        middleware(action);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const url = mockFetch.mock.calls[0][0];
        expect(url).toContain('/lights/nodes/node-1');
    });

    it('should use /lights/nodes for postEffectSetup', () => {
        const { middleware } = createMiddleware();
        const action = {
            type: 'TLIGHT_API',
            payload: {
                action: 'postEffectSetup',
                params: {
                    nodeId: 'node-1',
                    body: { some: 'data' }
                }
            }
        };

        middleware(action);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const url = mockFetch.mock.calls[0][0];
        // The implementation uses template literal: `${baseUrl}/light/node/${nodeId}/plugin/source`
        // We expect: `${baseUrl}/lights/nodes/${nodeId}/plugin/source`
        expect(url).toContain('/lights/nodes/node-1/plugin/source');
    });
});

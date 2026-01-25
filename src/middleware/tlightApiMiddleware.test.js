
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
        return { middleware, next, store };
    };

    describe('API action handling', () => {
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
            expect(url).toContain('/lights/nodes/node-1/plugin/source');
        });

        it('should call fetchNodeData endpoint', () => {
            const { middleware } = createMiddleware();
            const action = {
                type: 'TLIGHT_API',
                payload: {
                    action: 'fetchNodeData'
                }
            };

            middleware(action);

            expect(mockFetch).toHaveBeenCalledTimes(1);
            const url = mockFetch.mock.calls[0][0];
            expect(url).toContain('/lights/nodes');
        });
    });

    describe('Non-API actions', () => {
        it('should pass through non-API actions unchanged', () => {
            const { middleware, next } = createMiddleware();
            const action = {
                type: 'SOME_OTHER_ACTION',
                payload: { data: 'test' }
            };

            middleware(action);

            expect(next).toHaveBeenCalledWith(action);
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should not intercept Redux actions', () => {
            const { middleware, next } = createMiddleware();
            const action = {
                type: 'NODES_RECEIVED',
                payload: { nodes: [] }
            };

            middleware(action);

            expect(next).toHaveBeenCalledWith(action);
            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    describe('Error handling', () => {
        it('should handle fetch errors gracefully', async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

            const { middleware } = createMiddleware();
            const action = {
                type: 'TLIGHT_API',
                payload: {
                    action: 'fetchNodeData'
                }
            };

            // Should not throw
            const result = middleware(action);
            await expect(result).rejects.toThrow('Network error');
        });

        it('should handle missing params gracefully', () => {
            const { middleware } = createMiddleware();
            const action = {
                type: 'TLIGHT_API',
                payload: {
                    action: 'postNodeValues',
                    params: {
                        // Missing nodeId
                        values: { brightness: 100 }
                    }
                }
            };

            expect(() => middleware(action)).toThrow();
        });
    });

    describe('Request formatting', () => {
        it('should send correct body for postNodeValues', () => {
            const { middleware } = createMiddleware();
            const action = {
                type: 'TLIGHT_API',
                payload: {
                    action: 'postNodeValues',
                    params: {
                        nodeId: 'node-1',
                        values: { brightness: 200, mode: 'SINGLE' }
                    }
                }
            };

            middleware(action);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/lights/nodes/node-1'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json; charset=utf-8'
                    }),
                    body: expect.any(String)
                })
            );

            const body = JSON.parse(mockFetch.mock.calls[0][1].body);
            expect(body).toMatchObject({
                id: 'node-1',
                state: expect.objectContaining({
                    brightness: 200,
                    mode: 'SINGLE'
                })
            });
        });

        it('should send correct body for postLightValues', () => {
            const { middleware } = createMiddleware();
            const action = {
                type: 'TLIGHT_API',
                payload: {
                    action: 'postLightValues',
                    params: {
                        nodeId: 'node-1',
                        lightId: 'node-1-light-1',
                        values: { red: 255, green: 0, blue: 0 }
                    }
                }
            };

            middleware(action);

            const body = JSON.parse(mockFetch.mock.calls[0][1].body);
            expect(body).toMatchObject({
                id: 'node-1',
                state: {
                    mode: 'INDIVIDUAL'
                },
                individualData: [
                    {
                        id: '1', // Note: lightId is split on '-' and second part is used
                        color: {
                            red: 255,
                            green: 0,
                            blue: 0
                        }
                    }
                ]
            });
        });
    });

    describe('Throttled actions', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should throttle postNodeValuesThrottled', () => {
            const { middleware } = createMiddleware();

            // Call multiple times rapidly
            for (let i = 0; i < 5; i++) {
                middleware({
                    type: 'TLIGHT_API',
                    payload: {
                        action: 'postNodeValuesThrottled',
                        params: {
                            nodeId: 'node-1',
                            values: { brightness: i * 50 }
                        }
                    }
                });
            }

            // Should be throttled (called once immediately, then maybe once more after throttle)
            expect(mockFetch.mock.calls.length).toBeLessThan(5);
        });

        it('should throttle postLightValuesThrottled', () => {
            const { middleware } = createMiddleware();

            // Call multiple times rapidly
            for (let i = 0; i < 5; i++) {
                middleware({
                    type: 'TLIGHT_API',
                    payload: {
                        action: 'postLightValuesThrottled',
                        params: {
                            nodeId: 'node-1',
                            lightId: 'node-1-light-1',
                            values: { brightness: i * 50 }
                        }
                    }
                });
            }

            // Should be throttled
            expect(mockFetch.mock.calls.length).toBeLessThan(5);
        });
    });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import EffectCard from './EffectCard';
import effectsReducer from '../../../slices/effectsSlice';
import { AVAILABLE_EFFECTS, EFFECT_PROPERTIES, COMMON_PROPERTIES } from '../../../constants/availableEffects';

// Test setup
describe('EffectCard Property Editing', () => {
    // We need a specific effect type with known properties to test
    const initialState = {
        effects: {
            configuredEffects: [
                {
                    id: 'effect-1',
                    name: 'Test Effect',
                    type: 'SmoothColors', // User mentioned this
                    effectProperties: {
                        effect: {
                            lightCount: 5,
                            pluginOpts: {
                                effectOpts: {
                                    duration: 10
                                }
                            }
                        }
                    }
                }
            ],
            effectsInUsePerNode: {}
        }
    };

    it('should update effect property when slider/input changes', async () => {
        const store = configureStore({
            reducer: {
                effects: effectsReducer,
                nodes: (state = {}) => state,
                nodeValues: (state = {}) => state,
                lightValues: (state = {}) => state
            },
            preloadedState: initialState
        });

        render(
            <Provider store={store}>
                <EffectCard id="effect-1" />
            </Provider>
        );

        // Debug: Log rendered HTML to check what inputs are available
        // screen.debug(); 

        // Look for 'lightCount' label and associated input
        // The label is in a div, input in SliderAndInput.
        // We expect TWO inputs with value 5: the slider and the text box.
        // We want to edit the text box.
        const inputs = screen.getAllByDisplayValue('5');
        expect(inputs.length).toBeGreaterThan(0);
        const input = inputs.find(i => i.type === 'text');

        expect(input).toBeInTheDocument();

        // Change value to 10
        fireEvent.change(input, { target: { value: '10' } });

        // Check if store updated
        // Note: dispatch is synchronous in testing with simple thunks/actions usually
        const state = store.getState();
        const effect = state.effects.configuredEffects[0];

        // Check nested path
        expect(effect.effectProperties.effect.lightCount).toBe(10);
    });
    it('should update DEEP nested property (duration) correctly', () => {
        const store = configureStore({
            reducer: {
                effects: effectsReducer,
                nodes: (state = {}) => state,
                nodeValues: (state = {}) => state,
                lightValues: (state = {}) => state
            },
            preloadedState: initialState
        });

        render(
            <Provider store={store}>
                <EffectCard id="effect-1" />
            </Provider>
        );

        // Ideally we should look for 'duration' label, but for simplicity finding value '10' works.
        // Assuming no other input has value 10.
        const inputs = screen.getAllByDisplayValue('10');
        expect(inputs.length).toBeGreaterThan(0);
        const input = inputs.find(i => i.type === 'text');
        expect(input).toBeInTheDocument();

        // Change duration to 20
        fireEvent.change(input, { target: { value: '20' } });

        const state = store.getState();
        const effect = state.effects.configuredEffects[0];

        // Check nested path: effect.pluginOpts.effectOpts.duration
        // Note: The path construction in EffectCard depends on 'availableEffects.js' structure.
        // For SmoothColors, duration is in effectOpts.
        // EffectCard prepends "effect".
        // And intermediate objects "pluginOpts", "effectOpts".
        // BUT wait, does EffectCard flatten paths or nest them?
        // Logic: currentPath = `${rootPath}.${params.name}`
        // rootPath starts as "effect".
        // pluginOpts -> effect.pluginOpts
        // effectOpts -> effect.pluginOpts.effectOpts
        // duration -> effect.pluginOpts.effectOpts.duration

        // HOWEVER, my initialState structure (Step 16) was:
        // effectProperties: { effect: { lightCount: 5, duration: 10 } }
        // This structure implies 'duration' is DIRECTLY under 'effect'.
        // But 'availableEffects.js' defines it DEEP.
        // EffectCard renders based on SCHEME.
        // If SCHEME says it's deep, EffectCard constructs DEEP path.
        // If data is FLAT (like in my initial state), then DEEP path lookup will FAIL (return undefined/0).

        // Therefore, my previous test setup was likely WRONG for 'duration' if I want to simulate REAL behavior.
        // Real behavior: effectCreated initializes empty object.
        // User edits -> setEffectProperty uses deep path.
        // So state should eventually have deep structure.

        // Check nested path: effect.pluginOpts.effectOpts.duration
        expect(state.effects.configuredEffects[0].effectProperties.effect.pluginOpts.effectOpts.duration).toBe(20);
    });
});

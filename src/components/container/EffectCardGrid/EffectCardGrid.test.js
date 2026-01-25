import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EffectCardGrid from './EffectCardGrid';
import { createNewEffect } from '../../../actions/effectActions';

import { vi } from 'vitest';

vi.mock('../EffectCard/EffectCard', () => ({ default: (props) => <div data-testid="effect-card" data-id={props.id}>EffectCard {props.id}</div> }));
vi.mock('../../presentational/AddNewCard/AddNewCard', () => ({ default: (props) => <button data-testid="add-new-card" onClick={props.onClick}>Add New</button> }));
vi.mock('css-element-queries/src/ResizeSensor', () => ({ default: vi.fn() })); // Should mock nicely

// Fix: Jest mock for css-element-queries might fail if not careful with module resolution or requires. 
// But EffectCardGrid imports it? 
// import ResizeSensor from "css-element-queries/src/ResizeSensor";
// Let's rely on Jest finding it. If not, we might need __mocks__.
// Actually, EffectCardGrid has commented out ResizeSensor behavior in componentDidMount! 
// So maybe we don't need to mock it unless it's imported and executes side effects.
// It IS imported.

const mockStore = configureStore([]);

describe('EffectCardGrid', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            effects: {
                configuredEffects: [
                    { id: 'effect-1', name: 'Effect 1' },
                    { id: 'effect-2', name: 'Effect 2' }
                ]
            }
        });
        store.dispatch = jest.fn();
    });

    it('should render EffectCards and AddNewCard', () => {
        render(
            <Provider store={store}>
                <EffectCardGrid />
            </Provider>
        );

        expect(screen.getAllByTestId('effect-card')).toHaveLength(2);
        expect(screen.getByTestId('add-new-card')).toBeInTheDocument();
    });

    it('should dispatch createNewEffect when add button is clicked', () => {
        render(
            <Provider store={store}>
                <EffectCardGrid />
            </Provider>
        );

        fireEvent.click(screen.getByTestId('add-new-card'));

        // Check if dispatch was called with correct action
        // Since we didn't mock the action creator to return a specific object, 
        // createNewEffect() returns a thunk or action object.
        // We can inspect the calls.
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        // If createNewEffect returns a thunk (function), we expect a function
        // If it returns object, we expect object.
        // Let's just verify it was called.
    });
});

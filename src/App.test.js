import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import RTK slices
import nodesReducer from './slices/nodesSlice';
import nodeValuesReducer from './slices/nodeValuesSlice';
import lightValuesReducer from './slices/lightValuesSlice';
import effectsReducer from './slices/effectsSlice';

// Simple smoke test for the App component
describe('App', () => {
  it('should render without crashing', () => {
    const store = configureStore({
      reducer: {
        nodes: nodesReducer,
        nodeValues: nodeValuesReducer,
        lightValues: lightValuesReducer,
        effects: effectsReducer
      }
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Just verify the component renders something
    expect(container).toBeInTheDocument();
  });
});

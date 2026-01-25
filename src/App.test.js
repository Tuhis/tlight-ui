import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import App from './App';
import createRootReducer from './reducer';

// Simple smoke test for the App component
describe('App', () => {
  it('should render without crashing', () => {
    const history = createMemoryHistory();
    const store = createStore(
      createRootReducer(history),
      applyMiddleware(routerMiddleware(history), thunk)
    );

    const { container } = render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );

    // Just verify the component renders something
    expect(container).toBeInTheDocument();
  });
});

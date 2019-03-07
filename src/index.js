import _ from "lodash";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from "redux";
import { createBrowserHistory } from 'history'
import { routerMiddleware, push, onLocationChanged } from 'connected-react-router'
import logger from "redux-logger";
import thunk from "redux-thunk";
import { ConnectedRouter } from 'connected-react-router'

import createRootReducer from "./reducer";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { loadNodeData } from "./actions/nodeActions";
import { createTlightApiMiddleware } from "./middleware/tlightApiMiddleware";

const persistedState = localStorage.getItem("reduxState") ? JSON.parse(localStorage.getItem("reduxState")) : undefined;

const tlightApiMiddleware = createTlightApiMiddleware({
    baseUrl: `${document.location.protocol}//${document.location.hostname}:3001/v1`
});

const history = createBrowserHistory();

const store = createStore(
    createRootReducer(history),
    persistedState,
    applyMiddleware(
        routerMiddleware(history),
        thunk,
        logger,
        tlightApiMiddleware,
    )
);

// Effects are persisted in browser's localStorage. Debounce to prevent performance issues.
store.subscribe(_.debounce(() => {
    const stateToPersist = {
        effects: store.getState().effects,
        router: store.getState().router
    };

    localStorage.setItem('reduxState', JSON.stringify(stateToPersist));
}, 500, { trailing: true }));

store.dispatch(loadNodeData());

const location = store.getState().router.location || {};

if (location.pathname !== history.location.pathname) {
    store.dispatch(push(location.pathname));
}

store.dispatch(onLocationChanged(history.location, history.action, true));

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

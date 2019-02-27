import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from "redux";
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import logger from "redux-logger";
import thunk from "redux-thunk";
import { ConnectedRouter } from 'connected-react-router'

import createRootReducer from "./reducer";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


import { loadNodeData } from "./actions/nodeActions";
import { createTlightApiMiddleware } from "./middleware/tlightApiMiddleware";

const tlightApiMiddleware = createTlightApiMiddleware({
    baseUrl: `${document.location.protocol}//${document.location.hostname}:3001/v1`
});

const history = createBrowserHistory();

const store = createStore(
    createRootReducer(history),
    applyMiddleware(
        routerMiddleware(history),
        thunk,
        logger,
        tlightApiMiddleware,
    )
);

store.dispatch(loadNodeData());

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

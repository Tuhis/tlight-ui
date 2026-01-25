import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import _ from 'lodash';

// Import RTK slices
import nodesReducer from './slices/nodesSlice';
import nodeValuesReducer from './slices/nodeValuesSlice';
import lightValuesReducer from './slices/lightValuesSlice';
import effectsReducer from './slices/effectsSlice';

import { createTlightApiMiddleware } from './middleware/tlightApiMiddleware';
import { loadNodeData } from './actions/nodeActions';

const tlightApiMiddleware = createTlightApiMiddleware({
    baseUrl: `${document.location.protocol}//${document.location.hostname}:3001/v1`
});

// Load persisted state
const persistedState = localStorage.getItem("reduxState")
    ? JSON.parse(localStorage.getItem("reduxState"))
    : undefined;

export const store = configureStore({
    reducer: {
        nodes: nodesReducer,
        nodeValues: nodeValuesReducer,
        lightValues: lightValuesReducer,
        effects: effectsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(tlightApiMiddleware)
            .concat(logger),
    preloadedState: persistedState
});

// Effects are persisted in browser's localStorage. Debounce to prevent performance issues.
store.subscribe(_.debounce(() => {
    const stateToPersist = {
        effects: store.getState().effects
    };

    localStorage.setItem('reduxState', JSON.stringify(stateToPersist));
}, 500, { trailing: true }));

// Load initial data
store.dispatch(loadNodeData());

export default store;

import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'
import nodes from "./reducers/nodes";
import nodeValues from "./reducers/nodeValues";
import lightValues from "./reducers/lightValues";
import effects from "./reducers/effects";

export default history => combineReducers({
    nodes,
    effects,
    nodeValues,
    lightValues,
    router: connectRouter(history)
});

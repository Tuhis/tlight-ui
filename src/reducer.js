import { combineReducers } from "redux";
import nodes from "./reducers/nodes";
import nodeValues from "./reducers/nodeValues";
import lightValues from "./reducers/lightValues";
import effects from "./reducers/effects";

export default () => combineReducers({
    nodes,
    effects,
    nodeValues,
    lightValues
});

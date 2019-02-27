import _ from "lodash";
import {
    NODES_RECEIVED,
    NODE_VALUES_CHANGED
} from "../actions/nodeActions";

const initialState = {};

const nodeValues = (state = initialState, action) => {
    switch (action.type) {
        case NODES_RECEIVED:
            return {
                ..._.chain(action.payload.nodes)
                    .map(node => {
                        return {
                            id: node.id,
                            mode: node.state.mode,
                            brightness: _.get(node.state, "brightness"),
                            red: _.get(node.state, "color.red"),
                            green: _.get(node.state, "color.green"),
                            blue: _.get(node.state, "color.blue")
                        };
                    })
                    .keyBy("id")
                    .value()
            };

        case NODE_VALUES_CHANGED:
            return {
                ...state,
                [action.payload.nodeId]: {
                    ..._.get(state, action.payload.nodeId, {}),
                    ...action.payload.values
                }
            };

        default:
            return state;
    }
}

export default nodeValues;

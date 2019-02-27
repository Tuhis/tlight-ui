import _ from "lodash";
import {
    NODES_RECEIVED
} from "../actions/nodeActions";
import { LIGHT_VALUES_CHANGED } from "../actions/lightActions";

const initialState = {};

const lightValues = (state = initialState, action) => {
    switch (action.type) {
        case NODES_RECEIVED:
            return {
                ..._.chain(action.payload.nodes)
                    .map(node => {
                        return {
                            ..._.chain(node.lights)
                                .map(light => {
                                    return {
                                        id: node.id + "-" + light.id,
                                        type: light.type,
                                        brightness: _.get(light, "brightness"),
                                        red: _.get(light, "color.red"),
                                        green: _.get(light, "color.green"),
                                        blue: _.get(light, "color.blue")
                                    };
                                })
                                .keyBy("id")
                                .value()
                        };
                    })
                    // .keyBy("id")
                    .value()
            };

        case LIGHT_VALUES_CHANGED:
        return {
            ...state,
            [action.payload.nodeId]: {
                ..._.get(state, action.payload.nodeId, {}),
                [action.payload.lightId]: {
                    ..._.get(state, [action.payload.nodeId, action.payload.lightId], {}),
                    ...action.payload.values
                }
            }
        };

        default:
            return state;
    }
}

export default lightValues;

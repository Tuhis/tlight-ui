import _ from "lodash";
import { NODES_RECEIVED } from "../actions/nodeActions";
import { CREATE_NEW_EFFECT, SET_EFFECT_NAME, SET_EFFECT_TYPE, SET_EFFECT_PROPERTY, SELECT_EFFECT } from "../actions/effectActions";

const initialState = {
    configuredEffects: [],
    effectsInUsePerNode: {}
};

const effects = (state = initialState, action) => {

    switch (action.type) {

        // Create structure for effectsInUsePerNode property
        case NODES_RECEIVED:
            return {
                ...state,
                effectsInUsePerNode: _.chain(action.payload.nodes)
                    .map(node => ({
                        nodeId: node.id,
                        nodeName: node.name,
                        effectId: null
                    }))
                    .keyBy("nodeId")
                    .value()
            };

        case CREATE_NEW_EFFECT:
            return {
                ...state,
                configuredEffects: [
                    ...state.configuredEffects,
                    createNewEffect()
                ]
            };

        case SELECT_EFFECT: {
            return {
                ...state,
                effectsInUsePerNode: {
                    ...state.effectsInUsePerNode,
                    [action.payload.nodeId]: {
                        ...state.effectsInUsePerNode[action.payload.nodeId],
                        effectId: action.payload.effectId
                    }
                }
            };
        }

        case SET_EFFECT_NAME: {
            const effectId = action.payload.effectId;

            return {
                ...state,
                configuredEffects: _.map(state.configuredEffects, item => {
                    if (effectId !== item.id) {
                        return item;
                    }

                    return {
                        ...item,
                        name: action.payload.name
                    };
                })
            };
        }

        case SET_EFFECT_TYPE: {
            const effectId = action.payload.effectId;

            return {
                ...state,
                configuredEffects: _.map(state.configuredEffects, item => {
                    if (effectId !== item.id) {
                        return item;
                    }

                    return {
                        ...item,
                        type: action.payload.type,
                        effectProperties: {}
                    };
                })
            };
        }

        case SET_EFFECT_PROPERTY: {
            const effectId = action.payload.effectId;
            const path = action.payload.path;
            const value = action.payload.value;

            return {
                ...state,
                configuredEffects: _.map(state.configuredEffects, item => {
                    if (effectId !== item.id) {
                        return item;
                    }

                    const newItem = _.cloneDeep(item);

                    _.set(newItem.effectProperties, path, value);

                    return newItem;
                })
            };
        }

        default:
            return state;
    }
}

function createNewEffect() {
    return {
        id: _.uniqueId(),
        name: "Effect Name",
        type: null,
        effectProperties: {}
    };
}

export default effects;

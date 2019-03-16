import _ from "lodash";

export const CREATE_NEW_EFFECT = "CREATE_NEW_EFFECT";
export const SET_EFFECT_NAME = "SET_EFFECT_NAME";
export const SET_EFFECT_TYPE = "SET_EFFECT_TYPE";
export const SET_EFFECT_PROPERTY = "SET_EFFECT_PROPERTY";
export const SELECT_EFFECT = "SELECT_EFFECT";
export const DELETE_EFFECT = "DELETE_EFFECT";

export const createNewEffect = () => ({
    type: CREATE_NEW_EFFECT
});

export const selectEffectAC = (nodeId, effectId) => ({
    type: SELECT_EFFECT,
    payload: {
        nodeId: nodeId,
        effectId: effectId
    }
});

export const setEffectName = (id, name) => ({
    type: SET_EFFECT_NAME,
    payload: {
        effectId: id,
        name: name
    }
});

export const setEffectType = (id, type) => ({
    type: SET_EFFECT_TYPE,
    payload: {
        effectId: id,
        type: type
    }
});

export const setEffectProperty = (id, path, value) => ({
    type: SET_EFFECT_PROPERTY,
    payload: {
        effectId: id,
        path: path,
        value: value
    }
});

export const deleteEffect = (id) => ({
    type: DELETE_EFFECT,
    payload: {
        effectId: id
    }
});

export const selectEffect = (nodeId, effectId, color) => {
    return (dispatch, getState) => {
        const effectConfiguration = _.find(getState().effects.configuredEffects, ["id", effectId]);
        const effectParams = effectConfiguration.effectProperties.effect;

        // Few hacks
        if (!_.isUndefined(color)) {
            effectParams.colors = color;
        }

        if (color === false && effectParams.lightCount === 3) {
            effectParams.pluginOpts.effectOpts.startBrightness = [
                effectParams.pluginOpts.effectOpts.startColor.red,
                effectParams.pluginOpts.effectOpts.startColor.green,
                effectParams.pluginOpts.effectOpts.startColor.blue,
            ];

            effectParams.pluginOpts.effectOpts.endBrightness = [
                effectParams.pluginOpts.effectOpts.endColor.red,
                effectParams.pluginOpts.effectOpts.endColor.green,
                effectParams.pluginOpts.effectOpts.endColor.blue,
            ];
        }

        effectParams.name = effectConfiguration.type;

        return dispatch({
            type: "TLIGHT_API",
            payload: {
                action: "postEffectSetup",
                params: {
                    nodeId: nodeId,
                    body: effectParams
                }
            }
        })
        .then(() => {
            dispatch(selectEffectAC(nodeId, effectId));
            console.log("Plugin setup!");
        });
    }
}

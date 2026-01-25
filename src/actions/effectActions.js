import _ from "lodash";
import {
    effectCreated,
    effectSelected,
    effectNameSet,
    effectTypeSet,
    effectPropertySet,
    effectDeleted
} from '../slices/effectsSlice';

// Export action creators from slice
export const createNewEffect = effectCreated;
export const selectEffectAC = (nodeId, effectId) => effectSelected({ nodeId, effectId });
export const setEffectName = (id, name) => effectNameSet({ effectId: id, name });
export const setEffectType = (id, type) => effectTypeSet({ effectId: id, type });
export const setEffectProperty = (id, path, value) => effectPropertySet({ effectId: id, path, value });
export const deleteEffect = (id) => effectDeleted({ effectId: id });

// Export constants for compatibility
export const CREATE_NEW_EFFECT = "effects/effectCreated";
export const SET_EFFECT_NAME = "effects/effectNameSet";
export const SET_EFFECT_TYPE = "effects/effectTypeSet";
export const SET_EFFECT_PROPERTY = "effects/effectPropertySet";
export const SELECT_EFFECT = "effects/effectSelected";
export const DELETE_EFFECT = "effects/effectDeleted";

export const selectEffect = (nodeId, effectId, color) => {
    return (dispatch, getState) => {
        const effectConfiguration = _.find(getState().effects.configuredEffects, ["id", effectId]);

        // Deep clone to avoid mutating state
        const effectParams = _.cloneDeep(effectConfiguration.effectProperties.effect);

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
    };
};

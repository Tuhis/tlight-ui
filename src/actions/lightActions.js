import _ from "lodash";

export const LIGHT_VALUES_CHANGED = "LIGHT_VALUES_CHANGED";

export function lightValuesChanged(nodeId, lightId, values) {
    return {
        type: LIGHT_VALUES_CHANGED,
        payload: {
            nodeId,
            lightId,
            values
        }
    };
}

export function changeLightValues(nodeId, lightId, values) {
    return dispatch => {
        return dispatch({
            type: "TLIGHT_API",
            payload: {
                action: "postLightValuesThrottled",
                params: {
                    nodeId,
                    lightId,
                    values
                }
            }
        })
            .then(() => dispatch(lightValuesChanged(nodeId, lightId, values)));
    };
}



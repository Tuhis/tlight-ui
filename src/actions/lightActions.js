import { lightValuesChanged } from '../slices/lightValuesSlice';

export const LIGHT_VALUES_CHANGED = "lightValues/lightValuesChanged";

// Re-export the action creator from the slice for compatibility
export { lightValuesChanged };

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
            .then(() => dispatch(lightValuesChanged({ nodeId, lightId, values })));
    };
}

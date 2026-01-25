import { nodesReceived } from '../slices/nodesSlice';
import { nodeValuesInitialized, nodeValuesChanged } from '../slices/nodeValuesSlice';
import { lightValuesInitialized } from '../slices/lightValuesSlice';
import { effectsInitializedForNodes } from '../slices/effectsSlice';

// Export for compatibility (can be removed later if not used elsewhere)
export const NODES_RECEIVED = "nodes/nodesReceived";
export const NODE_VALUES_CHANGED = "nodeValues/nodeValuesChanged";

// Re-export actions from slices
export { nodesReceived, nodeValuesChanged };

export function changeNodeValues(nodeId, values) {
    return dispatch => {
        return dispatch({
            type: "TLIGHT_API",
            payload: {
                action: "postNodeValuesThrottled",
                params: {
                    nodeId,
                    values
                }
            }
        })
            .then(() => dispatch(nodeValuesChanged({ nodeId, values })));
    };
}

export function loadNodeData() {
    return dispatch => {
        return dispatch({
            type: "TLIGHT_API",
            payload: {
                action: "fetchNodeData"
            }
        })
            .then(response => response.json())
            .then(nodeData => dispatch(receiveNodeData(nodeData)));
    };
}

function receiveNodeData(nodeData) {
    console.log("Got NodeData!");
    console.log(nodeData);

    // Return a thunk that dispatches all related slice actions
    return dispatch => {
        const nodes = nodeData.nodes;
        const payload = { nodes };

        // Dispatch to all slices that need this data
        dispatch(nodesReceived(payload));
        dispatch(nodeValuesInitialized(payload));
        dispatch(lightValuesInitialized(payload));
        dispatch(effectsInitializedForNodes(payload));
    };
}

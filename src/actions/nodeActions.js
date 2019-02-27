import _ from "lodash";

export const NODES_RECEIVED = "NODES_RECEIVED";
export const NODE_RECEIVED = "NODE_RECEIVED";
export const NODE_VALUES_CHANGED = "NODE_VALUES_CHANGED";

export function nodesReceived(nodes) {
    return {
        type: NODES_RECEIVED,
        payload: {
            nodes
        }
    };
}

export function nodeReceived(nodeId, node) {
    return {
        type: NODE_RECEIVED,
        payload: {
            nodeId,
            node
        }
    };
}

export function nodeValuesChanged(nodeId, values) {
    return {
        type: NODE_VALUES_CHANGED,
        payload: {
            nodeId,
            values
        }
    };
}

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
            .then(() => dispatch(nodeValuesChanged(nodeId, values)));
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
    return nodesReceived(nodeData.nodes);
}



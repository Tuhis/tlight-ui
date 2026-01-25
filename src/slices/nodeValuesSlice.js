import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const nodeValuesSlice = createSlice({
    name: 'nodeValues',
    initialState: {},
    reducers: {
        nodeValuesInitialized: (state, action) => {
            // Initialize from NODES_RECEIVED
            const nodeValues = _.chain(action.payload.nodes)
                .map(node => ({
                    id: node.id,
                    mode: node.state.mode,
                    brightness: _.get(node.state, "brightness"),
                    red: _.get(node.state, "color.red"),
                    green: _.get(node.state, "color.green"),
                    blue: _.get(node.state, "color.blue")
                }))
                .keyBy("id")
                .value();

            return nodeValues;
        },
        nodeValuesChanged: (state, action) => {
            const { nodeId, values } = action.payload;
            if (!state[nodeId]) {
                state[nodeId] = {};
            }
            Object.assign(state[nodeId], values);
        }
    }
});

export const { nodeValuesInitialized, nodeValuesChanged } = nodeValuesSlice.actions;
export default nodeValuesSlice.reducer;

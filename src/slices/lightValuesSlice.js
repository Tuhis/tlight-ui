import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const lightValuesSlice = createSlice({
    name: 'lightValues',
    initialState: {},
    reducers: {
        lightValuesInitialized: (state, action) => {
            // Initialize from NODES_RECEIVED
            const lightValues = _.chain(action.payload.nodes)
                .map(node => ({
                    [node.id]: _.chain(node.lights)
                        .map(light => ({
                            id: node.id + "-" + light.id,
                            type: light.type,
                            brightness: _.get(light, "brightness"),
                            red: _.get(light, "color.red"),
                            green: _.get(light, "color.green"),
                            blue: _.get(light, "color.blue")
                        }))
                        .keyBy("id")
                        .value()
                }))
                .value();

            return Object.assign({}, ...lightValues);
        },
        lightValuesChanged: (state, action) => {
            const { nodeId, lightId, values } = action.payload;
            if (!state[nodeId]) {
                state[nodeId] = {};
            }
            if (!state[nodeId][lightId]) {
                state[nodeId][lightId] = {};
            }
            Object.assign(state[nodeId][lightId], values);
        }
    }
});

export const { lightValuesInitialized, lightValuesChanged } = lightValuesSlice.actions;
export default lightValuesSlice.reducer;

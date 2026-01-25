import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    configuredEffects: [],
    effectsInUsePerNode: {}
};

const effectsSlice = createSlice({
    name: 'effects',
    initialState,
    reducers: {
        effectsInitializedForNodes: (state, action) => {
            // Create structure for effectsInUsePerNode from NODES_RECEIVED
            state.effectsInUsePerNode = _.chain(action.payload.nodes)
                .map(node => ({
                    nodeId: node.id,
                    nodeName: node.name,
                    effectId: null
                }))
                .keyBy("nodeId")
                .value();
        },
        effectCreated: (state) => {
            state.configuredEffects.push({
                id: uuidv4(),
                name: "Effect Name",
                type: null,
                effectProperties: {}
            });
        },
        effectSelected: (state, action) => {
            const { nodeId, effectId } = action.payload;
            if (state.effectsInUsePerNode[nodeId]) {
                state.effectsInUsePerNode[nodeId].effectId = effectId;
            }
        },
        effectDeleted: (state, action) => {
            state.configuredEffects = state.configuredEffects.filter(
                item => item.id !== action.payload.effectId
            );
        },
        effectNameSet: (state, action) => {
            const { effectId, name } = action.payload;
            const effect = state.configuredEffects.find(e => e.id === effectId);
            if (effect) {
                effect.name = name;
            }
        },
        effectTypeSet: (state, action) => {
            const { effectId, type } = action.payload;
            const effect = state.configuredEffects.find(e => e.id === effectId);
            if (effect) {
                effect.type = type;
                effect.effectProperties = {};
            }
        },
        effectPropertySet: (state, action) => {
            const { effectId, path, value } = action.payload;
            const effect = state.configuredEffects.find(e => e.id === effectId);
            if (effect) {
                _.set(effect.effectProperties, path, value);
            }
        }
    }
});

export const {
    effectsInitializedForNodes,
    effectCreated,
    effectSelected,
    effectDeleted,
    effectNameSet,
    effectTypeSet,
    effectPropertySet
} = effectsSlice.actions;

export default effectsSlice.reducer;

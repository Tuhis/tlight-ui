import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const nodesSlice = createSlice({
    name: 'nodes',
    initialState: {},
    reducers: {
        nodesReceived: (state, action) => {
            // RTK uses Immer, so we can "mutate" state directly
            const newNodes = _.keyBy(action.payload.nodes, "id");
            Object.assign(state, newNodes);
        }
    }
});

export const { nodesReceived } = nodesSlice.actions;
export default nodesSlice.reducer;

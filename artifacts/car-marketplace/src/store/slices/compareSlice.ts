import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const MAX = 3;

interface CompareState {
  ids: string[];
}

const initialState: CompareState = { ids: [] };

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addCompare(state, action: PayloadAction<string>) {
      if (!state.ids.includes(action.payload) && state.ids.length < MAX) {
        state.ids.push(action.payload);
      }
    },
    removeCompare(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((x) => x !== action.payload);
    },
    toggleCompare(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else if (state.ids.length < MAX) {
        state.ids.push(id);
      }
    },
    clearCompare(state) {
      state.ids = [];
    },
  },
});

export const { addCompare, removeCompare, toggleCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;

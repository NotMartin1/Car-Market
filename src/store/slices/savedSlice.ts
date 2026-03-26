import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const LS_KEY = "automarket_saved";

interface SavedState {
  ids: string[];
}

const initialState: SavedState = { ids: [] };

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    initSaved(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
    toggleSaved(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids = [...state.ids, id];
      }
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(state.ids));
      } catch {}
    },
  },
});

export const { initSaved, toggleSaved } = savedSlice.actions;
export default savedSlice.reducer;

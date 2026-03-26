import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const MAX_OPEN = 3;

interface OpenConv {
  id: string;
  minimized: boolean;
}

interface ChatState {
  openConvs: OpenConv[];
}

const initialState: ChatState = { openConvs: [] };

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existing = state.openConvs.find((c) => c.id === id);
      if (existing) {
        state.openConvs = state.openConvs.map((c) =>
          c.id === id ? { ...c, minimized: false } : c
        );
      } else {
        const trimmed =
          state.openConvs.length >= MAX_OPEN
            ? state.openConvs.slice(1)
            : state.openConvs;
        state.openConvs = [...trimmed, { id, minimized: false }];
      }
    },
    closeChat(state, action: PayloadAction<string>) {
      state.openConvs = state.openConvs.filter((c) => c.id !== action.payload);
    },
    toggleMinimize(state, action: PayloadAction<string>) {
      state.openConvs = state.openConvs.map((c) =>
        c.id === action.payload ? { ...c, minimized: !c.minimized } : c
      );
    },
  },
});

export const { openChat, closeChat, toggleMinimize } = chatSlice.actions;
export default chatSlice.reducer;

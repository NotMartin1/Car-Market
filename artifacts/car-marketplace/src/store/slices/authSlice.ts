import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CURRENT_USER, type MockUser } from "@/lib/mock-data";

type Tab = "login" | "register";

interface AuthState {
  user: MockUser | null;
  modalOpen: boolean;
  modalTab: Tab;
}

const initialState: AuthState = {
  user: CURRENT_USER,
  modalOpen: false,
  modalTab: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.user = CURRENT_USER;
    },
    logout(state) {
      state.user = null;
    },
    updateUser(state, action: PayloadAction<Partial<MockUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    openLoginModal(state) {
      state.modalOpen = true;
      state.modalTab = "login";
    },
    openRegisterModal(state) {
      state.modalOpen = true;
      state.modalTab = "register";
    },
    closeModal(state) {
      state.modalOpen = false;
    },
    switchModalTab(state, action: PayloadAction<Tab>) {
      state.modalTab = action.payload;
    },
  },
});

export const {
  login,
  logout,
  updateUser,
  openLoginModal,
  openRegisterModal,
  closeModal,
  switchModalTab,
} = authSlice.actions;

export default authSlice.reducer;

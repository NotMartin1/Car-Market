"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  openLoginModal,
  openRegisterModal,
  closeModal,
  switchModalTab,
} from "@/store/slices/authSlice";

type Tab = "login" | "register";

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuthModal() {
  const dispatch = useAppDispatch();
  const isOpen   = useAppSelector((s) => s.auth.modalOpen);
  const tab      = useAppSelector((s) => s.auth.modalTab) as Tab;

  return {
    isOpen,
    tab,
    openLogin:    () => dispatch(openLoginModal()),
    openRegister: () => dispatch(openRegisterModal()),
    close:        () => dispatch(closeModal()),
    switchTab:    (t: Tab) => dispatch(switchModalTab(t)),
  };
}

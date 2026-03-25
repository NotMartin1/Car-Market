"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Tab = "login" | "register";

interface AuthModalContextValue {
  isOpen: boolean;
  tab: Tab;
  openLogin: () => void;
  openRegister: () => void;
  close: () => void;
  switchTab: (t: Tab) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab,    setTab]    = useState<Tab>("login");

  const openLogin    = useCallback(() => { setTab("login");    setIsOpen(true); }, []);
  const openRegister = useCallback(() => { setTab("register"); setIsOpen(true); }, []);
  const close        = useCallback(() => setIsOpen(false), []);
  const switchTab    = useCallback((t: Tab) => setTab(t), []);

  return (
    <AuthModalContext.Provider value={{ isOpen, tab, openLogin, openRegister, close, switchTab }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}

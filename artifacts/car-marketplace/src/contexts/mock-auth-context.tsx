"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CURRENT_USER, type MockUser } from "@/lib/mock-data";

interface AuthContextValue {
  user: MockUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (updates: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(CURRENT_USER);

  const login = useCallback(() => setUser(CURRENT_USER), []);
  const logout = useCallback(() => setUser(null), []);
  const updateUser = useCallback((updates: Partial<MockUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading: false,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMockAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useMockAuth must be used within MockAuthProvider");
  return ctx;
}

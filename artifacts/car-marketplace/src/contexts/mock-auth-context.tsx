"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  login as loginAction,
  logout as logoutAction,
  updateUser as updateUserAction,
  openLoginModal,
} from "@/store/slices/authSlice";
import type { MockUser } from "@/lib/mock-data";

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useMockAuth() {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading: false,
    login:      () => dispatch(openLoginModal()),
    logout:     () => dispatch(logoutAction()),
    updateUser: (updates: Partial<MockUser>) => dispatch(updateUserAction(updates)),
  };
}

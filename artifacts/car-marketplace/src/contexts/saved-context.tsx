"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleSaved } from "@/store/slices/savedSlice";

export function SavedProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useSaved() {
  const dispatch = useAppDispatch();
  const ids      = useAppSelector((s) => s.saved.ids);
  const savedIds = new Set(ids);

  return {
    savedIds,
    toggle:  (id: string) => dispatch(toggleSaved(id)),
    isSaved: (id: string) => savedIds.has(id),
  };
}

"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addCompare,
  removeCompare,
  toggleCompare,
  clearCompare,
} from "@/store/slices/compareSlice";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCompare() {
  const dispatch = useAppDispatch();
  const ids      = useAppSelector((s) => s.compare.ids);

  return {
    ids,
    add:    (id: string) => dispatch(addCompare(id)),
    remove: (id: string) => dispatch(removeCompare(id)),
    toggle: (id: string) => dispatch(toggleCompare(id)),
    isIn:   (id: string) => ids.includes(id),
    clear:  () => dispatch(clearCompare()),
    isFull: ids.length >= 3,
  };
}

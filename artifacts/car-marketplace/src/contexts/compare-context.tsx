"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const MAX = 3;

interface CompareContextValue {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  isIn: (id: string) => boolean;
  clear: () => void;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const add    = useCallback((id: string) => setIds((p) => p.includes(id) || p.length >= MAX ? p : [...p, id]), []);
  const remove = useCallback((id: string) => setIds((p) => p.filter((x) => x !== id)), []);
  const toggle = useCallback((id: string) => setIds((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length >= MAX ? p : [...p, id]), []);
  const isIn   = useCallback((id: string) => ids.includes(id), [ids]);
  const clear  = useCallback(() => setIds([]), []);

  return (
    <CompareContext.Provider value={{ ids, add, remove, toggle, isIn, clear, isFull: ids.length >= MAX }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

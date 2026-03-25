"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface OpenConv {
  id: string;
  minimized: boolean;
}

interface FloatingChatCtx {
  openConvs: OpenConv[];
  openChat: (id: string) => void;
  closeChat: (id: string) => void;
  toggleMinimize: (id: string) => void;
  isOpen: (id: string) => boolean;
}

const FloatingChatContext = createContext<FloatingChatCtx>({
  openConvs: [],
  openChat: () => {},
  closeChat: () => {},
  toggleMinimize: () => {},
  isOpen: () => false,
});

export function FloatingChatProvider({ children }: { children: React.ReactNode }) {
  const [openConvs, setOpenConvs] = useState<OpenConv[]>([]);

  const openChat = useCallback((id: string) => {
    setOpenConvs((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) {
        return prev.map((c) => (c.id === id ? { ...c, minimized: false } : c));
      }
      const next = prev.length >= 3 ? prev.slice(1) : prev;
      return [...next, { id, minimized: false }];
    });
  }, []);

  const closeChat = useCallback((id: string) => {
    setOpenConvs((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setOpenConvs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, minimized: !c.minimized } : c))
    );
  }, []);

  const isOpen = useCallback(
    (id: string) => openConvs.some((c) => c.id === id),
    [openConvs]
  );

  return (
    <FloatingChatContext.Provider value={{ openConvs, openChat, closeChat, toggleMinimize, isOpen }}>
      {children}
    </FloatingChatContext.Provider>
  );
}

export const useFloatingChat = () => useContext(FloatingChatContext);

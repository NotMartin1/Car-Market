"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  openChat as openChatAction,
  closeChat as closeChatAction,
  toggleMinimize as toggleMinimizeAction,
} from "@/store/slices/chatSlice";

export function FloatingChatProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useFloatingChat() {
  const dispatch  = useAppDispatch();
  const openConvs = useAppSelector((s) => s.chat.openConvs);

  return {
    openConvs,
    openChat:       (id: string) => dispatch(openChatAction(id)),
    closeChat:      (id: string) => dispatch(closeChatAction(id)),
    toggleMinimize: (id: string) => dispatch(toggleMinimizeAction(id)),
    isOpen:         (id: string) => openConvs.some((c) => c.id === id),
  };
}

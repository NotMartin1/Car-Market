"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { markRead, markAllRead } from "@/store/slices/notificationsSlice";

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useNotifications() {
  const dispatch      = useAppDispatch();
  const notifications = useAppSelector((s) => s.notifications.items);
  const unreadCount   = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markRead:    (id: string) => dispatch(markRead(id)),
    markAllRead: () => dispatch(markAllRead()),
  };
}

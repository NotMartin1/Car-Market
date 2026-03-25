"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { MockNotification } from "@/lib/mock-data";

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "notif-001",
    type: "message",
    title: "New message from Bob",
    body: "Hey! Love the Tacoma. Is the price negotiable?",
    href: "/messages/conv-002",
    read: false,
    createdAt: "2026-03-21T09:00:00Z",
  },
  {
    id: "notif-002",
    type: "inquiry",
    title: "New inquiry on your Miata",
    body: "Jane Smith asked: Has it ever been tracked?",
    href: "/my-listings/lst-010/inquiries",
    read: false,
    createdAt: "2026-03-22T16:00:00Z",
  },
  {
    id: "notif-003",
    type: "price_drop",
    title: "Price drop alert",
    body: "BMW 3 Series you saved dropped to $29,500",
    href: "/listings/lst-006",
    read: false,
    createdAt: "2026-03-23T10:00:00Z",
  },
  {
    id: "notif-004",
    type: "offer",
    title: "New offer received",
    body: "Alice Wang offered $30,500 on your Tacoma",
    href: "/my-listings",
    read: true,
    createdAt: "2026-03-20T14:00:00Z",
  },
  {
    id: "notif-005",
    type: "listing_sold",
    title: "Listing marked as sold",
    body: "Your Honda Civic has been marked as sold. Congrats!",
    href: "/my-listings",
    read: true,
    createdAt: "2026-02-28T10:00:00Z",
  },
];

interface NotificationsContextValue {
  notifications: MockNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markRead, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

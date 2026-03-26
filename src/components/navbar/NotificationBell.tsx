"use client";

import Link from "next/link";
import { Bell, MessageCircle, Tag, MessageSquare, TrendingDown, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const notifIcon: Record<string, React.ReactNode> = {
  message:      <MessageCircle className="w-4 h-4 text-blue-500" />,
  offer:        <Tag className="w-4 h-4 text-amber-500" />,
  inquiry:      <MessageSquare className="w-4 h-4 text-violet-500" />,
  price_drop:   <TrendingDown className="w-4 h-4 text-emerald-500" />,
  listing_sold: <ShoppingBag className="w-4 h-4 text-red-500" />,
};

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell({
  notifications,
  unreadCount,
  markRead,
  markAllRead,
  isOpen,
  setOpen,
  menuRef,
}: {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors",
          isOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
        )}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-display font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto styled-scrollbar divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => { markRead(n.id); setOpen(false); }}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    {notifIcon[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-tight", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

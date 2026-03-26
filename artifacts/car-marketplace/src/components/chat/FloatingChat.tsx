"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X } from "lucide-react";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useFloatingChat } from "@/contexts/floating-chat-context";
import { getConversations } from "@/lib/mock-api";
import { CURRENT_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { MockUser } from "@/lib/mock-data";
import { ConversationList, type ConvSummary } from "./ConversationList";
import { MiniChatWindow } from "./MiniChatWindow";

export function FloatingChat() {
  const { isAuthenticated } = useMockAuth();
  const { openConvs, openChat, closeChat, toggleMinimize } = useFloatingChat();
  const [listOpen, setListOpen] = useState(false);
  const [convs, setConvs] = useState<ConvSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getConversations()
      .then((data) => {
        const { conversations } = data as {
          conversations: (ConvSummary & {
            buyerId: string;
            sellerId: string;
            buyer: MockUser | null;
            seller: MockUser | null;
          })[];
        };
        setConvs(
          conversations.map((c) => ({
            id: c.id,
            listing: c.listing,
            otherUser: c.buyerId === CURRENT_USER.id ? c.seller : c.buyer,
            lastMessage: c.lastMessage,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setListOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAuthenticated) return null;

  const WINDOW_WIDTH = 292;
  const WINDOW_GAP = 8;
  const BUTTON_RIGHT = 24;
  const BUTTON_WIDTH = 56;

  return (
    <div className="hidden md:block">
      {openConvs.map((conv, i) => (
        <div
          key={conv.id}
          style={{
            position: "fixed",
            bottom: 0,
            right: BUTTON_RIGHT + BUTTON_WIDTH + WINDOW_GAP + i * (WINDOW_WIDTH + WINDOW_GAP),
            zIndex: 100,
          }}
        >
          <MiniChatWindow
            convId={conv.id}
            minimized={conv.minimized}
            onClose={() => closeChat(conv.id)}
            onMinimize={() => toggleMinimize(conv.id)}
          />
        </div>
      ))}

      <div ref={triggerRef} className="fixed bottom-6 right-6 z-[101]">
        {listOpen && (
          <ConversationList
            convs={convs}
            loading={loading}
            onSelect={(id) => { openChat(id); setListOpen(false); }}
            onClose={() => setListOpen(false)}
          />
        )}
        <button
          onClick={() => setListOpen((v) => !v)}
          className={cn(
            "w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:opacity-90 transition-all duration-200",
            listOpen && "scale-95 shadow-2xl",
          )}
        >
          {listOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}

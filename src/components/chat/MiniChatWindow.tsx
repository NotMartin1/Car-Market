"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Minus, Send, Car } from "lucide-react";
import { getConversation, sendMessage } from "@/lib/mock-api";
import { cn } from "@/lib/utils";
import type { MockUser, MockListing, MockMessage } from "@/lib/mock-data";

interface ChatData {
  conversation: { id: string; buyerId: string; sellerId: string; listingId: string };
  listing: MockListing | null;
  messages: MockMessage[];
  otherUser: MockUser | null;
  currentUserId: string;
}

function getDisplayName(user: MockUser | null): string {
  if (!user) return "User";
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
}

function getInitials(user: MockUser | null): string {
  return getDisplayName(user).split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function MiniChatWindow({
  convId,
  minimized,
  onClose,
  onMinimize,
}: {
  convId: string;
  minimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
}) {
  const [data, setData] = useState<ChatData | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(() => {
    getConversation(convId).then((res) => {
      const r = res as {
        conversation: { id: string; buyerId: string; sellerId: string; listingId: string };
        listing: MockListing | null;
        buyer: MockUser | null;
        seller: MockUser | null;
        messages: MockMessage[];
        currentUserId: string;
      };
      const otherUser = r.currentUserId === r.conversation.buyerId ? r.seller : r.buyer;
      setData({
        conversation: r.conversation,
        listing: r.listing,
        messages: r.messages,
        otherUser,
        currentUserId: r.currentUserId,
      });
    });
  }, [convId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!minimized) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [data?.messages.length, minimized]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    try {
      await sendMessage(convId, content);
      fetchData();
    } catch {
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const title = data?.otherUser ? getDisplayName(data.otherUser) : "...";
  const subtitle = data?.listing
    ? `${data.listing.year} ${data.listing.make} ${data.listing.model}`
    : "";

  return (
    <div className="w-72 bg-card border border-border rounded-t-2xl shadow-2xl flex flex-col overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 bg-primary cursor-pointer select-none"
        onClick={onMinimize}
      >
        <div className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden flex-shrink-0 border border-primary-foreground/30">
          {data?.otherUser?.profileImageUrl ? (
            <img src={data.otherUser.profileImageUrl} className="w-full h-full object-cover" alt="" />
          ) : (
            <span className="text-[10px] font-bold text-primary-foreground">
              {getInitials(data?.otherUser ?? null)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-primary-foreground truncate">{title}</p>
          {subtitle && (
            <p className="text-[10px] text-primary-foreground/70 truncate">{subtitle}</p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className="text-primary-foreground/70 hover:text-primary-foreground p-0.5"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="text-primary-foreground/70 hover:text-primary-foreground p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {!minimized && (
        <>
          <div className="overflow-y-auto p-3 space-y-2" style={{ height: 280 }}>
            {!data ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : data.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Car className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Say hi to get started!</p>
              </div>
            ) : (
              data.messages.map((msg) => {
                const isMe = msg.senderId === data.currentUserId;
                return (
                  <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[82%] px-3 py-1.5 rounded-2xl text-xs leading-relaxed",
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm",
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-2 flex gap-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Aa"
              className="flex-1 bg-muted rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

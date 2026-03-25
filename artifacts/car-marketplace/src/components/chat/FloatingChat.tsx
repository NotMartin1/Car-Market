"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Minus, Send, Car } from "lucide-react";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useFloatingChat } from "@/contexts/floating-chat-context";
import { getConversations, getConversation, sendMessage } from "@/lib/mock-api";
import { CURRENT_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { MockUser, MockListing, MockMessage } from "@/lib/mock-data";

interface ConvSummary {
  id: string;
  listing: MockListing | null;
  otherUser: MockUser | null;
  lastMessage: MockMessage | null;
}

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

function ConvListPanel({
  convs,
  loading,
  onSelect,
  onClose,
}: {
  convs: ConvSummary[];
  loading: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-[72px] right-0 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <h3 className="font-display font-bold text-sm text-foreground">Messages</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : convs.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No conversations yet
          </div>
        ) : (
          convs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { onSelect(conv.id); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
                {conv.otherUser?.profileImageUrl ? (
                  <img
                    src={conv.otherUser.profileImageUrl}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary bg-primary/15">
                    {getInitials(conv.otherUser)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {getDisplayName(conv.otherUser)}
                </p>
                {conv.listing && (
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.listing.year} {conv.listing.make} {conv.listing.model}
                  </p>
                )}
                {conv.lastMessage && (
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.lastMessage.senderId === CURRENT_USER.id ? "You: " : ""}
                    {conv.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function MiniChatWindow({
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
      const r = res as { conversation: { id: string; buyerId: string; sellerId: string; listingId: string }; listing: MockListing | null; buyer: MockUser | null; seller: MockUser | null; messages: MockMessage[]; currentUserId: string };
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
                          : "bg-muted text-foreground rounded-bl-sm"
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
        const { conversations } = data as { conversations: (ConvSummary & { buyerId: string; sellerId: string; buyer: MockUser | null; seller: MockUser | null })[] };
        setConvs(
          conversations.map((c) => ({
            id: c.id,
            listing: c.listing,
            otherUser: c.buyerId === CURRENT_USER.id ? c.seller : c.buyer,
            lastMessage: c.lastMessage,
          }))
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
          <ConvListPanel
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
            listOpen && "scale-95 shadow-2xl"
          )}
        >
          {listOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}

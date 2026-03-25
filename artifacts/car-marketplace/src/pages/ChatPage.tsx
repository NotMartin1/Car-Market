"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@workspace/replit-auth-web";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, Send, Car, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

interface ChatData {
  conversation: { id: string; listingId: string; buyerId: string; sellerId: string };
  listing: { id: string; make: string; model: string; year: number; price: string; images: string[]; status: string; sellerId: string } | null;
  buyer: UserProfile | null;
  seller: UserProfile | null;
  messages: MessageItem[];
  currentUserId: string;
}

interface UserProfile {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

function getDisplayName(user: UserProfile | null): string {
  if (!user) return "User";
  if (user.firstName || user.lastName) return [user.firstName, user.lastName].filter(Boolean).join(" ");
  return user.username ?? "User";
}

function getInitials(user: UserProfile | null): string {
  return getDisplayName(user).split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function ChatPage({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    const res = await fetch(`/api/conversations/${conversationId}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    } else if (res.status === 404) {
      router.push("/messages");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }
    if (user) {
      fetchData();
      pollRef.current = setInterval(fetchData, 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [user, authLoading, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || sending) return;
    setSending(true);
    const content = inputValue.trim();
    setInputValue("");
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        setInputValue(content);
      }
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-96 bg-muted rounded-2xl" />
          <div className="h-16 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { conversation, listing, buyer, seller, messages, currentUserId } = data;
  const otherUser = currentUserId === conversation.buyerId ? seller : buyer;
  const listingTitle = listing ? `${listing.year} ${listing.make} ${listing.model}` : "Listing";
  const thumb = listing?.images?.[0];

  const groupedMessages: Array<{ date: string; msgs: MessageItem[] }> = [];
  messages.forEach((m) => {
    const day = format(new Date(m.createdAt), "MMMM d, yyyy");
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === day) {
      last.msgs.push(m);
    } else {
      groupedMessages.push({ date: day, msgs: [m] });
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/messages">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUser?.profileImageUrl ?? undefined} />
          <AvatarFallback>{getInitials(otherUser)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{getDisplayName(otherUser)}</p>
          <p className="text-sm text-muted-foreground truncate">
            {currentUserId === conversation.buyerId ? "Seller" : "Buyer"}
          </p>
        </div>
      </div>

      {listing && (
        <Link
          href={`/listings/${listing.id}`}
          className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl mb-4 hover:border-primary/40 transition-colors group shrink-0"
        >
          {thumb ? (
            <img src={thumb} alt={listingTitle} className="w-14 h-14 rounded-xl object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
              <Car className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{listingTitle}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {Number(listing.price).toLocaleString()}
              </span>
              {listing.status === "sold" && <Badge variant="secondary" className="text-xs">Sold</Badge>}
            </div>
          </div>
        </Link>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquarePlaceholder />
            <p className="mt-3 text-sm">No messages yet. Say hello!</p>
          </div>
        )}

        {groupedMessages.map(({ date, msgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground px-2">{date}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-2">
              {msgs.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMe && (
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarImage src={otherUser?.profileImageUrl ?? undefined} />
                        <AvatarFallback className="text-[10px]">{getInitials(otherUser)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[11px] text-muted-foreground px-1">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-border pt-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 resize-none bg-muted rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32 overflow-y-auto"
            style={{ height: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || sending}
            className="rounded-2xl px-4 py-3 h-auto shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

function MessageSquarePlaceholder() {
  return (
    <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center">
      <Send className="w-6 h-6 text-muted-foreground/50" />
    </div>
  );
}

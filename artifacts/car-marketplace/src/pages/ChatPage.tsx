"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { getConversation, sendMessage } from "@/lib/mock-api";
import { Navbar } from "@/components/layout/Navbar";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, Send, Car, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { MockUser, MockListing, MockMessage } from "@/lib/mock-data";

interface ChatData {
  conversation: { id: string; listingId: string; buyerId: string; sellerId: string };
  listing: MockListing | null;
  buyer: MockUser | null;
  seller: MockUser | null;
  messages: MockMessage[];
  currentUserId: string;
}

function getDisplayName(user: MockUser | null): string {
  if (!user) return "User";
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
}

function getInitials(user: MockUser | null): string {
  return getDisplayName(user)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ChatPage({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useMockAuth();
  const [data, setData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchData = () => {
    getConversation(conversationId)
      .then((res) => setData(res as ChatData))
      .catch(() => router.push("/messages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    fetchData();
  }, [isAuthenticated, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    setSending(true);
    const content = inputValue.trim();
    setInputValue("");
    try {
      await sendMessage(conversationId, content);
      fetchData();
    } catch {
      setInputValue(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 pt-28 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded-2xl" />
            <div className="h-96 bg-muted rounded-2xl" />
            <div className="h-16 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { conversation, listing, buyer, seller, messages, currentUserId } = data;
  const otherUser = currentUserId === conversation.buyerId ? seller : buyer;
  const listingTitle = listing ? `${listing.year} ${listing.make} ${listing.model}` : "Listing";
  const thumb = listing?.images?.[0];

  const groupedMessages: Array<{ date: string; msgs: MockMessage[] }> = [];
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
    <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col w-full" style={{ height: "calc(100vh - 5rem)", paddingTop: "5rem" }}>
      {/* Header */}
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
          <p className="text-sm text-muted-foreground">
            {currentUserId === conversation.buyerId ? "Seller" : "Buyer"}
          </p>
        </div>
      </div>

      {/* Listing card */}
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
            <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {listingTitle}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {Number(listing.price).toLocaleString()}
              </span>
              {listing.status === "sold" && (
                <Badge variant="secondary" className="text-xs">
                  Sold
                </Badge>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
              <Send className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm">No messages yet. Say hello!</p>
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

      {/* Input */}
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
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || sending}
            className="rounded-2xl px-4 py-3 h-auto shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
    </div>
  );
}

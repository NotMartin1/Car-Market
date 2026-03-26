"use client";

import { X, Car } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";
import type { MockUser, MockListing, MockMessage } from "@/lib/mock-data";

export interface ConvSummary {
  id: string;
  listing: MockListing | null;
  otherUser: MockUser | null;
  lastMessage: MockMessage | null;
}

function getDisplayName(user: MockUser | null): string {
  if (!user) return "User";
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
}

function getInitials(user: MockUser | null): string {
  return getDisplayName(user).split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function ConversationList({
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
                  <img src={conv.otherUser.profileImageUrl} className="w-full h-full object-cover" alt="" />
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

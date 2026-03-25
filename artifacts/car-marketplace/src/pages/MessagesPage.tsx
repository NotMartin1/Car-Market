"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { getConversations } from "@/lib/mock-api";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Car, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { MockUser, MockListing, MockMessage } from "@/lib/mock-data";
import { CURRENT_USER } from "@/lib/mock-data";

interface ConversationSummary {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  updatedAt: string;
  listing: MockListing | null;
  buyer: MockUser | null;
  seller: MockUser | null;
  lastMessage: MockMessage | null;
}

function getDisplayName(user: MockUser | null): string {
  if (!user) return "Unknown";
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

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useMockAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    getConversations()
      .then((data) => setConversations(data.conversations as ConversationSummary[]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-2xl h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">Your conversations with buyers and sellers</p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No conversations yet</h2>
          <p className="text-muted-foreground mb-6">
            When you message a seller or receive inquiries, they'll appear here.
          </p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Car className="w-4 h-4" />
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const iAmBuyer = conv.buyerId === CURRENT_USER.id;
            const otherUser = iAmBuyer ? conv.seller : conv.buyer;
            const otherLabel = iAmBuyer ? "Seller" : "Buyer";
            const listingTitle = conv.listing
              ? `${conv.listing.year} ${conv.listing.make} ${conv.listing.model}`
              : "Unknown Listing";
            const thumb = conv.listing?.images?.[0];

            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all group"
              >
                {thumb ? (
                  <img src={thumb} alt={listingTitle} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Car className="w-7 h-7 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-foreground truncate">{listingTitle}</span>
                    {conv.listing?.status === "sold" && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        Sold
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-5 h-5 text-[10px]">
                      <AvatarImage src={otherUser?.profileImageUrl ?? undefined} />
                      <AvatarFallback>{getInitials(otherUser)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {otherLabel}: {getDisplayName(otherUser)}
                    </span>
                  </div>
                  {conv.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage.senderId === user?.id ? "You: " : ""}
                      {conv.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No messages yet</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {conv.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

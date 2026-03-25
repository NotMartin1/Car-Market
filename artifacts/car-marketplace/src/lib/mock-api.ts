import {
  CURRENT_USER,
  OTHER_USERS,
  INITIAL_LISTINGS,
  INITIAL_INQUIRIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  type MockListing,
  type MockConversation,
  type MockMessage,
  type MockUser,
} from "./mock-data";

function uuid() {
  return "id-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function now() {
  return new Date().toISOString();
}

const store = {
  listings: [...INITIAL_LISTINGS],
  inquiries: [...INITIAL_INQUIRIES],
  conversations: [...INITIAL_CONVERSATIONS],
  messages: [...INITIAL_MESSAGES],
};

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function getUserById(id: string): MockUser | null {
  if (id === CURRENT_USER.id) return CURRENT_USER;
  return OTHER_USERS.find((u) => u.id === id) ?? null;
}

export type ListingFilters = {
  make?: string;
  model?: string;
  status?: string;
  vehicleType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  limit?: number;
};

export async function getListings(filters: ListingFilters = {}) {
  let results = store.listings.filter((l) => l.status !== "deleted");

  if (filters.status) results = results.filter((l) => l.status === filters.status);
  if (filters.make) results = results.filter((l) => l.make.toLowerCase().includes(filters.make!.toLowerCase()));
  if (filters.model) results = results.filter((l) => l.model.toLowerCase().includes(filters.model!.toLowerCase()));
  if (filters.vehicleType) results = results.filter((l) => l.vehicleType === filters.vehicleType);
  if (filters.location) results = results.filter((l) => l.location.toLowerCase().includes(filters.location!.toLowerCase()));
  if (filters.minPrice != null) results = results.filter((l) => Number(l.price) >= filters.minPrice!);
  if (filters.maxPrice != null) results = results.filter((l) => Number(l.price) <= filters.maxPrice!);
  if (filters.minYear != null) results = results.filter((l) => l.year >= filters.minYear!);
  if (filters.maxYear != null) results = results.filter((l) => l.year <= filters.maxYear!);
  if (filters.limit) results = results.slice(0, filters.limit);

  return delay({ listings: results, total: results.length });
}

export async function getListing(id: string) {
  const listing = store.listings.find((l) => l.id === id && l.status !== "deleted");
  if (!listing) throw new Error("Listing not found");
  const seller = getUserById(listing.sellerId);
  return delay({ ...listing, seller });
}

export async function getMyListings() {
  const results = store.listings.filter((l) => l.sellerId === CURRENT_USER.id && l.status !== "deleted");
  return delay({ listings: results });
}

export type CreateListingInput = Omit<MockListing, "id" | "sellerId" | "status" | "createdAt" | "updatedAt">;

export async function createListing(input: CreateListingInput) {
  const listing: MockListing = {
    ...input,
    id: uuid(),
    sellerId: CURRENT_USER.id,
    status: "active",
    createdAt: now(),
    updatedAt: now(),
  };
  store.listings.unshift(listing);
  return delay(listing);
}

export async function updateListing(id: string, input: Partial<CreateListingInput & { status: MockListing["status"] }>) {
  const idx = store.listings.findIndex((l) => l.id === id && l.sellerId === CURRENT_USER.id);
  if (idx === -1) throw new Error("Listing not found or not authorized");
  store.listings[idx] = { ...store.listings[idx], ...input, updatedAt: now() };
  return delay(store.listings[idx]);
}

export async function deleteListing(id: string) {
  const idx = store.listings.findIndex((l) => l.id === id && l.sellerId === CURRENT_USER.id);
  if (idx === -1) throw new Error("Listing not found or not authorized");
  store.listings[idx] = { ...store.listings[idx], status: "deleted", updatedAt: now() };
  return delay({ success: true });
}

export async function createInquiry(listingId: string, data: { message: string; contactEmail: string; contactPhone?: string }) {
  const inquiry = {
    id: uuid(),
    listingId,
    senderId: CURRENT_USER.id,
    message: data.message,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone ?? null,
    createdAt: now(),
  };
  store.inquiries.push(inquiry);
  return delay(inquiry);
}

export async function getListingInquiries(listingId: string) {
  const results = store.inquiries.filter((i) => i.listingId === listingId);
  const enriched = results.map((inq) => {
    const sender = getUserById(inq.senderId);
    return {
      ...inq,
      senderFirstName: sender?.firstName ?? null,
      senderLastName: sender?.lastName ?? null,
      senderUsername: sender?.username ?? null,
    };
  });
  return delay({ inquiries: enriched });
}

export async function getMyInquiries() {
  const results = store.inquiries.filter((i) => i.senderId === CURRENT_USER.id);
  const enriched = results.map((inq) => {
    const listing = store.listings.find((l) => l.id === inq.listingId);
    return {
      ...inq,
      listingMake: listing?.make ?? "Unknown",
      listingModel: listing?.model ?? "Unknown",
      listingYear: listing?.year ?? 0,
    };
  });
  return delay({ inquiries: enriched });
}

export async function getConversations() {
  const results = store.conversations.filter(
    (c) => c.buyerId === CURRENT_USER.id || c.sellerId === CURRENT_USER.id,
  );
  const enriched = results.map((conv) => {
    const listing = store.listings.find((l) => l.id === conv.listingId) ?? null;
    const buyer = getUserById(conv.buyerId);
    const seller = getUserById(conv.sellerId);
    const msgs = store.messages
      .filter((m) => m.conversationId === conv.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { ...conv, listing, buyer, seller, lastMessage: msgs[0] ?? null };
  });
  enriched.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return delay({ conversations: enriched });
}

export async function getConversation(id: string) {
  const conv = store.conversations.find(
    (c) => c.id === id && (c.buyerId === CURRENT_USER.id || c.sellerId === CURRENT_USER.id),
  );
  if (!conv) throw new Error("Conversation not found");
  const listing = store.listings.find((l) => l.id === conv.listingId) ?? null;
  const buyer = getUserById(conv.buyerId);
  const seller = getUserById(conv.sellerId);
  const messages = store.messages
    .filter((m) => m.conversationId === id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return delay({ conversation: conv, listing, buyer, seller, messages, currentUserId: CURRENT_USER.id });
}

export async function startConversation(listingId: string): Promise<{ conversationId: string }> {
  const listing = store.listings.find((l) => l.id === listingId);
  if (!listing) throw new Error("Listing not found");
  if (listing.sellerId === CURRENT_USER.id) throw new Error("Cannot message yourself");

  const existing = store.conversations.find(
    (c) => c.listingId === listingId && c.buyerId === CURRENT_USER.id,
  );
  if (existing) return delay({ conversationId: existing.id });

  const conv: MockConversation = {
    id: uuid(),
    listingId,
    buyerId: CURRENT_USER.id,
    sellerId: listing.sellerId,
    createdAt: now(),
    updatedAt: now(),
  };
  store.conversations.push(conv);
  return delay({ conversationId: conv.id });
}

export async function sendMessage(conversationId: string, content: string) {
  const conv = store.conversations.find(
    (c) => c.id === conversationId && (c.buyerId === CURRENT_USER.id || c.sellerId === CURRENT_USER.id),
  );
  if (!conv) throw new Error("Conversation not found");

  const message: MockMessage = {
    id: uuid(),
    conversationId,
    senderId: CURRENT_USER.id,
    content: content.trim(),
    readAt: null,
    createdAt: now(),
  };
  store.messages.push(message);
  conv.updatedAt = now();
  return delay(message);
}

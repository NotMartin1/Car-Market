import { NextRequest, NextResponse } from "next/server";
import { db, conversationsTable, messagesTable, listingsTable, usersTable } from "@workspace/db";
import { eq, or, and, desc, inArray } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversations = await db
    .select({
      conversation: conversationsTable,
      listing: {
        id: listingsTable.id,
        make: listingsTable.make,
        model: listingsTable.model,
        year: listingsTable.year,
        images: listingsTable.images,
        status: listingsTable.status,
      },
      buyer: {
        id: usersTable.id,
        username: usersTable.username,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        profileImageUrl: usersTable.profileImageUrl,
      },
    })
    .from(conversationsTable)
    .leftJoin(listingsTable, eq(conversationsTable.listingId, listingsTable.id))
    .leftJoin(usersTable, eq(conversationsTable.buyerId, usersTable.id))
    .where(
      or(
        eq(conversationsTable.buyerId, user.id),
        eq(conversationsTable.sellerId, user.id),
      ),
    )
    .orderBy(desc(conversationsTable.updatedAt));

  const conversationIds = conversations.map((c) => c.conversation.id);
  const lastMessageMap = new Map<string, { id: string; conversationId: string; senderId: string; content: string; readAt: Date | null; createdAt: Date }>();

  if (conversationIds.length > 0) {
    const allMessages = await db
      .select()
      .from(messagesTable)
      .where(inArray(messagesTable.conversationId, conversationIds))
      .orderBy(desc(messagesTable.createdAt));

    for (const msg of allMessages) {
      if (!lastMessageMap.has(msg.conversationId)) {
        lastMessageMap.set(msg.conversationId, msg);
      }
    }
  }

  return NextResponse.json({
    conversations: conversations.map(({ conversation, listing, buyer }) => ({
      ...conversation,
      listing,
      buyer,
      lastMessage: lastMessageMap.get(conversation.id) ?? null,
    })),
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId, initialMessage } = await request.json();
  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }

  const [listing] = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.id, listingId))
    .limit(1);

  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (listing.sellerId === user.id) {
    return NextResponse.json({ error: "You cannot message yourself" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(conversationsTable)
    .where(
      and(
        eq(conversationsTable.listingId, listingId),
        eq(conversationsTable.buyerId, user.id),
      ),
    )
    .limit(1);

  if (existing) {
    if (initialMessage) {
      await db.insert(messagesTable).values({
        conversationId: existing.id,
        senderId: user.id,
        content: initialMessage,
      });
      await db
        .update(conversationsTable)
        .set({ updatedAt: new Date() })
        .where(eq(conversationsTable.id, existing.id));
    }
    return NextResponse.json({ conversationId: existing.id });
  }

  const [conversation] = await db
    .insert(conversationsTable)
    .values({
      listingId,
      buyerId: user.id,
      sellerId: listing.sellerId,
    })
    .returning();

  if (initialMessage) {
    await db.insert(messagesTable).values({
      conversationId: conversation.id,
      senderId: user.id,
      content: initialMessage,
    });
  }

  return NextResponse.json({ conversationId: conversation.id }, { status: 201 });
}

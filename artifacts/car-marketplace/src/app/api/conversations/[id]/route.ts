import { NextRequest, NextResponse } from "next/server";
import { db, conversationsTable, messagesTable, listingsTable, usersTable } from "@workspace/db";
import { eq, or, and, asc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [result] = await db
    .select({
      conversation: conversationsTable,
      listing: {
        id: listingsTable.id,
        make: listingsTable.make,
        model: listingsTable.model,
        year: listingsTable.year,
        price: listingsTable.price,
        images: listingsTable.images,
        status: listingsTable.status,
        sellerId: listingsTable.sellerId,
      },
    })
    .from(conversationsTable)
    .leftJoin(listingsTable, eq(conversationsTable.listingId, listingsTable.id))
    .where(
      and(
        eq(conversationsTable.id, id),
        or(
          eq(conversationsTable.buyerId, user.id),
          eq(conversationsTable.sellerId, user.id),
        ),
      ),
    )
    .limit(1);

  if (!result) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const [buyer, seller] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, result.conversation.buyerId)).limit(1),
    db.select().from(usersTable).where(eq(usersTable.id, result.conversation.sellerId)).limit(1),
  ]);

  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(asc(messagesTable.createdAt));

  await db
    .update(messagesTable)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(messagesTable.conversationId, id),
        eq(messagesTable.senderId, user.id === result.conversation.buyerId ? result.conversation.sellerId : result.conversation.buyerId),
      ),
    );

  return NextResponse.json({
    conversation: result.conversation,
    listing: result.listing,
    buyer: buyer[0] ?? null,
    seller: seller[0] ?? null,
    messages,
    currentUserId: user.id,
  });
}

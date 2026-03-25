import { NextRequest, NextResponse } from "next/server";
import { db, conversationsTable, messagesTable } from "@workspace/db";
import { eq, or, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [conversation] = await db
    .select()
    .from(conversationsTable)
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

  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const { content } = await request.json();
  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Message content required" }, { status: 400 });
  }

  const [message] = await db
    .insert(messagesTable)
    .values({
      conversationId: id,
      senderId: user.id,
      content: content.trim(),
    })
    .returning();

  await db
    .update(conversationsTable)
    .set({ updatedAt: new Date() })
    .where(eq(conversationsTable.id, id));

  return NextResponse.json(message, { status: 201 });
}

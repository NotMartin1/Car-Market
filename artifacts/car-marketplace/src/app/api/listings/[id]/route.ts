import { NextRequest, NextResponse } from "next/server";
import { db, listingsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateListingBody } from "@workspace/api-zod";
import { getSessionUser } from "@/lib/auth";

function listingRow(listing: typeof listingsTable.$inferSelect, seller: { id: string | null; username: string | null; firstName: string | null; lastName: string | null; profileImageUrl: string | null } | null) {
  return {
    ...listing,
    price: Number(listing.price),
    sellerUsername: seller?.username ?? null,
    sellerFirstName: seller?.firstName ?? null,
    sellerLastName: seller?.lastName ?? null,
    sellerProfileImageUrl: seller?.profileImageUrl ?? null,
  };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result] = await db.select({
    listing: listingsTable,
    seller: {
      id: usersTable.id,
      username: usersTable.username,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      profileImageUrl: usersTable.profileImageUrl,
    },
  })
    .from(listingsTable)
    .leftJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
    .where(eq(listingsTable.id, id))
    .limit(1);

  if (!result) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  return NextResponse.json(listingRow(result.listing, result.seller));
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const body = UpdateListingBody.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const [existing] = await db.select().from(listingsTable).where(eq(listingsTable.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (existing.sellerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updateData: Record<string, unknown> = { ...body.data, updatedAt: new Date() };
  if (updateData.price !== undefined) updateData.price = String(updateData.price);

  const [updated] = await db.update(listingsTable).set(updateData).where(eq(listingsTable.id, id)).returning();
  const [seller] = await db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1);

  return NextResponse.json(listingRow(updated, seller ?? null));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [existing] = await db.select().from(listingsTable).where(eq(listingsTable.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (existing.sellerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.update(listingsTable).set({ status: "deleted", updatedAt: new Date() }).where(eq(listingsTable.id, id));
  return NextResponse.json({ success: true });
}

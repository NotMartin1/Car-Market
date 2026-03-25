import { NextRequest, NextResponse } from "next/server";
import { db, listingsTable, inquiriesTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateInquiryBody } from "@workspace/api-zod";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [listing] = await db.select().from(listingsTable).where(eq(listingsTable.id, id)).limit(1);
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (listing.sellerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const inquiries = await db.select({
    inquiry: inquiriesTable,
    sender: {
      username: usersTable.username,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
    },
  })
    .from(inquiriesTable)
    .leftJoin(usersTable, eq(inquiriesTable.senderId, usersTable.id))
    .where(eq(inquiriesTable.listingId, id))
    .orderBy(desc(inquiriesTable.createdAt));

  return NextResponse.json({
    inquiries: inquiries.map(({ inquiry, sender }) => ({
      ...inquiry,
      senderUsername: sender?.username ?? null,
      senderFirstName: sender?.firstName ?? null,
      senderLastName: sender?.lastName ?? null,
      listingMake: listing.make,
      listingModel: listing.model,
      listingYear: listing.year,
    })),
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const body = CreateInquiryBody.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const [listing] = await db.select().from(listingsTable).where(eq(listingsTable.id, id)).limit(1);
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const [inquiry] = await db.insert(inquiriesTable).values({
    ...body.data,
    listingId: id,
    senderId: user.id,
  }).returning();

  const [sender] = await db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1);

  return NextResponse.json({
    ...inquiry,
    senderUsername: sender?.username ?? null,
    senderFirstName: sender?.firstName ?? null,
    senderLastName: sender?.lastName ?? null,
    listingMake: listing.make,
    listingModel: listing.model,
    listingYear: listing.year,
  }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { db, listingsTable, inquiriesTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inquiries = await db.select({
    inquiry: inquiriesTable,
    listing: {
      make: listingsTable.make,
      model: listingsTable.model,
      year: listingsTable.year,
    },
  })
    .from(inquiriesTable)
    .leftJoin(listingsTable, eq(inquiriesTable.listingId, listingsTable.id))
    .where(eq(inquiriesTable.senderId, user.id))
    .orderBy(desc(inquiriesTable.createdAt));

  return NextResponse.json({
    inquiries: inquiries.map(({ inquiry, listing }) => ({
      ...inquiry,
      senderUsername: user.username ?? null,
      senderFirstName: user.firstName ?? null,
      senderLastName: user.lastName ?? null,
      listingMake: listing?.make ?? null,
      listingModel: listing?.model ?? null,
      listingYear: listing?.year ?? null,
    })),
  });
}

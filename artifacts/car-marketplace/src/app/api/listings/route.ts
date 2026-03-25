import { NextRequest, NextResponse } from "next/server";
import { db, listingsTable, usersTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, or, sql, desc } from "drizzle-orm";
import { ListListingsQueryParams, CreateListingBody } from "@workspace/api-zod";
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

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const query = ListListingsQueryParams.safeParse(searchParams);

  if (!query.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const {
    make, model, yearMin, yearMax, priceMin, priceMax,
    mileageMax, location, condition, vehicleType, status,
    sellerId, limit = 24, offset = 0, search,
  } = query.data;

  const conditions = [];

  if (status) conditions.push(eq(listingsTable.status, status as "active" | "sold" | "deleted"));
  if (make) conditions.push(ilike(listingsTable.make, `%${make}%`));
  if (model) conditions.push(ilike(listingsTable.model, `%${model}%`));
  if (yearMin) conditions.push(gte(listingsTable.year, yearMin));
  if (yearMax) conditions.push(lte(listingsTable.year, yearMax));
  if (priceMin) conditions.push(gte(listingsTable.price, String(priceMin)));
  if (priceMax) conditions.push(lte(listingsTable.price, String(priceMax)));
  if (mileageMax) conditions.push(lte(listingsTable.mileage, mileageMax));
  if (location) conditions.push(ilike(listingsTable.location, `%${location}%`));
  if (condition) conditions.push(eq(listingsTable.condition, condition as "excellent" | "good" | "fair" | "poor"));
  if (vehicleType) conditions.push(eq(listingsTable.vehicleType, vehicleType as "car" | "motorcycle" | "truck" | "van" | "suv" | "rv" | "boat" | "other"));
  if (sellerId) conditions.push(eq(listingsTable.sellerId, sellerId));
  if (search) {
    conditions.push(or(
      ilike(listingsTable.make, `%${search}%`),
      ilike(listingsTable.model, `%${search}%`),
      ilike(listingsTable.description, `%${search}%`),
      ilike(listingsTable.location, `%${search}%`),
    )!);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [listings, countResult] = await Promise.all([
    db.select({
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
      .where(whereClause)
      .orderBy(desc(listingsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(listingsTable).where(whereClause),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  return NextResponse.json({
    listings: listings.map(({ listing, seller }) => listingRow(listing, seller)),
    total,
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const body = CreateListingBody.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const [listing] = await db.insert(listingsTable).values({
    ...body.data,
    price: String(body.data.price),
    sellerId: user.id,
    status: "active",
  }).returning();

  const [seller] = await db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1);

  return NextResponse.json(listingRow(listing, seller ?? null), { status: 201 });
}

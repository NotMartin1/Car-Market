import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { listingsTable, usersTable, inquiriesTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, or, sql, desc } from "drizzle-orm";
import {
  CreateListingBody,
  UpdateListingBody,
  ListListingsQueryParams,
  CreateInquiryBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/listings", async (req, res) => {
  try {
    const query = ListListingsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }

    const {
      make,
      model,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      mileageMax,
      location,
      condition,
      status = "active",
      sellerId,
      limit = 24,
      offset = 0,
      search,
    } = query.data;

    const conditions = [];

    if (status) {
      conditions.push(eq(listingsTable.status, status as "active" | "sold" | "deleted"));
    }
    if (make) conditions.push(ilike(listingsTable.make, `%${make}%`));
    if (model) conditions.push(ilike(listingsTable.model, `%${model}%`));
    if (yearMin) conditions.push(gte(listingsTable.year, yearMin));
    if (yearMax) conditions.push(lte(listingsTable.year, yearMax));
    if (priceMin) conditions.push(gte(listingsTable.price, String(priceMin)));
    if (priceMax) conditions.push(lte(listingsTable.price, String(priceMax)));
    if (mileageMax) conditions.push(lte(listingsTable.mileage, mileageMax));
    if (location) conditions.push(ilike(listingsTable.location, `%${location}%`));
    if (condition) conditions.push(eq(listingsTable.condition, condition as "excellent" | "good" | "fair" | "poor"));
    if (sellerId) conditions.push(eq(listingsTable.sellerId, sellerId));
    if (search) {
      conditions.push(
        or(
          ilike(listingsTable.make, `%${search}%`),
          ilike(listingsTable.model, `%${search}%`),
          ilike(listingsTable.description, `%${search}%`),
          ilike(listingsTable.location, `%${search}%`)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [listings, countResult] = await Promise.all([
      db
        .select({
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
      db
        .select({ count: sql<number>`count(*)` })
        .from(listingsTable)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    res.json({
      listings: listings.map(({ listing, seller }) => ({
        ...listing,
        price: Number(listing.price),
        sellerUsername: seller?.username ?? null,
        sellerFirstName: seller?.firstName ?? null,
        sellerLastName: seller?.lastName ?? null,
        sellerProfileImageUrl: seller?.profileImageUrl ?? null,
      })),
      total,
    });
  } catch (err) {
    req.log.error({ err }, "Error listing listings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/listings", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = CreateListingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [listing] = await db
      .insert(listingsTable)
      .values({
        ...body.data,
        price: String(body.data.price),
        sellerId: req.user!.id,
        status: "active",
      })
      .returning();

    const seller = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id))
      .limit(1);

    res.status(201).json({
      ...listing,
      price: Number(listing.price),
      sellerUsername: seller[0]?.username ?? null,
      sellerFirstName: seller[0]?.firstName ?? null,
      sellerLastName: seller[0]?.lastName ?? null,
      sellerProfileImageUrl: seller[0]?.profileImageUrl ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Error creating listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/listings/:id", async (req, res) => {
  try {
    const [result] = await db
      .select({
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
      .where(eq(listingsTable.id, req.params.id))
      .limit(1);

    if (!result) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    res.json({
      ...result.listing,
      price: Number(result.listing.price),
      sellerUsername: result.seller?.username ?? null,
      sellerFirstName: result.seller?.firstName ?? null,
      sellerLastName: result.seller?.lastName ?? null,
      sellerProfileImageUrl: result.seller?.profileImageUrl ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/listings/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = UpdateListingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(listingsTable)
      .where(eq(listingsTable.id, req.params.id))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    if (existing.sellerId !== req.user!.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const updateData: Record<string, unknown> = { ...body.data, updatedAt: new Date() };
    if (updateData.price !== undefined) {
      updateData.price = String(updateData.price);
    }

    const [updated] = await db
      .update(listingsTable)
      .set(updateData)
      .where(eq(listingsTable.id, req.params.id))
      .returning();

    const seller = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id))
      .limit(1);

    res.json({
      ...updated,
      price: Number(updated.price),
      sellerUsername: seller[0]?.username ?? null,
      sellerFirstName: seller[0]?.firstName ?? null,
      sellerLastName: seller[0]?.lastName ?? null,
      sellerProfileImageUrl: seller[0]?.profileImageUrl ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Error updating listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/listings/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(listingsTable)
      .where(eq(listingsTable.id, req.params.id))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    if (existing.sellerId !== req.user!.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await db
      .update(listingsTable)
      .set({ status: "deleted", updatedAt: new Date() })
      .where(eq(listingsTable.id, req.params.id));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/listings/:id/inquiries", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const [listing] = await db
      .select()
      .from(listingsTable)
      .where(eq(listingsTable.id, req.params.id))
      .limit(1);

    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    if (listing.sellerId !== req.user!.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const inquiries = await db
      .select({
        inquiry: inquiriesTable,
        sender: {
          username: usersTable.username,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
        },
      })
      .from(inquiriesTable)
      .leftJoin(usersTable, eq(inquiriesTable.senderId, usersTable.id))
      .where(eq(inquiriesTable.listingId, req.params.id))
      .orderBy(desc(inquiriesTable.createdAt));

    res.json({
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
  } catch (err) {
    req.log.error({ err }, "Error getting inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/listings/:id/inquiries", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = CreateInquiryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [listing] = await db
      .select()
      .from(listingsTable)
      .where(eq(listingsTable.id, req.params.id))
      .limit(1);

    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    const [inquiry] = await db
      .insert(inquiriesTable)
      .values({
        ...body.data,
        listingId: req.params.id,
        senderId: req.user!.id,
      })
      .returning();

    const sender = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id))
      .limit(1);

    res.status(201).json({
      ...inquiry,
      senderUsername: sender[0]?.username ?? null,
      senderFirstName: sender[0]?.firstName ?? null,
      senderLastName: sender[0]?.lastName ?? null,
      listingMake: listing.make,
      listingModel: listing.model,
      listingYear: listing.year,
    });
  } catch (err) {
    req.log.error({ err }, "Error creating inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/my-inquiries", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const inquiries = await db
      .select({
        inquiry: inquiriesTable,
        listing: {
          make: listingsTable.make,
          model: listingsTable.model,
          year: listingsTable.year,
        },
      })
      .from(inquiriesTable)
      .leftJoin(listingsTable, eq(inquiriesTable.listingId, listingsTable.id))
      .where(eq(inquiriesTable.senderId, req.user!.id))
      .orderBy(desc(inquiriesTable.createdAt));

    const sender = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id))
      .limit(1);

    res.json({
      inquiries: inquiries.map(({ inquiry, listing }) => ({
        ...inquiry,
        senderUsername: sender[0]?.username ?? null,
        senderFirstName: sender[0]?.firstName ?? null,
        senderLastName: sender[0]?.lastName ?? null,
        listingMake: listing?.make ?? null,
        listingModel: listing?.model ?? null,
        listingYear: listing?.year ?? null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting my inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

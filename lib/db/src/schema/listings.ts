import { pgTable, text, integer, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const conditionEnum = pgEnum("condition", ["excellent", "good", "fair", "poor"]);
export const statusEnum = pgEnum("listing_status", ["active", "sold", "deleted"]);
export const transmissionEnum = pgEnum("transmission", ["automatic", "manual"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["gasoline", "diesel", "electric", "hybrid"]);

export const listingsTable = pgTable("listings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sellerId: text("seller_id").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  condition: conditionEnum("condition").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  images: text("images").array().notNull().default([]),
  status: statusEnum("status").notNull().default("active"),
  transmission: transmissionEnum("transmission"),
  fuelType: fuelTypeEnum("fuel_type"),
  color: text("color"),
  bodyType: text("body_type"),
  vin: text("vin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({
  id: true,
  sellerId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;

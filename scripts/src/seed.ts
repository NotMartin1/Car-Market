import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";

const SAMPLE_LISTINGS = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: "22500",
    mileage: 34000,
    description: "Well-maintained Toyota Camry with full service history. Never been in an accident. Great fuel economy and reliability.",
    location: "Seattle, WA",
    condition: "excellent" as const,
    fuelType: "gasoline" as const,
    transmission: "automatic" as const,
    bodyType: "Sedan",
    color: "Silver",
    vehicleType: "car" as const,
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
  {
    make: "Ford",
    model: "F-150",
    year: 2019,
    price: "38500",
    mileage: 52000,
    description: "Powerful F-150 with towing package. V8 engine, 4WD, bed liner. Perfect for work or recreation.",
    location: "Dallas, TX",
    condition: "good" as const,
    fuelType: "gasoline" as const,
    transmission: "automatic" as const,
    bodyType: "Truck",
    color: "Blue",
    vehicleType: "truck" as const,
    images: ["https://images.unsplash.com/photo-1563720223185-11003d516935?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
  {
    make: "Honda",
    model: "CR-V",
    year: 2021,
    price: "26500",
    mileage: 21000,
    description: "Low mileage CR-V EX with backup camera, Apple CarPlay, and heated seats. One owner, no accidents.",
    location: "Denver, CO",
    condition: "excellent" as const,
    fuelType: "gasoline" as const,
    transmission: "automatic" as const,
    bodyType: "SUV",
    color: "White",
    vehicleType: "suv" as const,
    images: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
  {
    make: "Harley-Davidson",
    model: "Sportster 883",
    year: 2020,
    price: "7500",
    mileage: 8000,
    description: "Classic Harley Sportster in excellent condition. Garage kept, chrome pipes, comfortable for long rides.",
    location: "Phoenix, AZ",
    condition: "excellent" as const,
    fuelType: "gasoline" as const,
    transmission: "manual" as const,
    bodyType: "Motorcycle",
    color: "Black",
    vehicleType: "motorcycle" as const,
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
  {
    make: "BMW",
    model: "3 Series",
    year: 2022,
    price: "42000",
    mileage: 14000,
    description: "Like-new BMW 330i with M Sport package, panoramic sunroof, and premium sound system.",
    location: "Chicago, IL",
    condition: "excellent" as const,
    fuelType: "gasoline" as const,
    transmission: "automatic" as const,
    bodyType: "Sedan",
    color: "Black",
    vehicleType: "car" as const,
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2021,
    price: "35000",
    mileage: 25000,
    description: "Tesla Model 3 Standard Range with autopilot. Supercharging included. Excellent range and performance.",
    location: "San Francisco, CA",
    condition: "excellent" as const,
    fuelType: "electric" as const,
    transmission: "automatic" as const,
    bodyType: "Sedan",
    color: "White",
    vehicleType: "car" as const,
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
  {
    make: "Jeep",
    model: "Wrangler",
    year: 2021,
    price: "42000",
    mileage: 22000,
    description: "Jeep Wrangler Rubicon 4-door. Rock rails, skid plates, and a 3-inch lift kit. Ready for trails.",
    location: "Salt Lake City, UT",
    condition: "good" as const,
    fuelType: "gasoline" as const,
    transmission: "automatic" as const,
    bodyType: "SUV",
    color: "Red",
    vehicleType: "suv" as const,
    images: ["https://images.unsplash.com/photo-1506877872776-b0f7e2f84f29?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
  {
    make: "Volkswagen",
    model: "Golf GTI",
    year: 2020,
    price: "28500",
    mileage: 30000,
    description: "Fun and practical Golf GTI with performance package. Plaid seats, DSG gearbox, sport suspension.",
    location: "Boston, MA",
    condition: "good" as const,
    fuelType: "gasoline" as const,
    transmission: "automatic" as const,
    bodyType: "Hatchback",
    color: "Gray",
    vehicleType: "car" as const,
    images: ["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800"],
    status: "active" as const,
    sellerId: "system",
  },
];

async function seed() {
  console.log("Seeding listings...");

  const existing = await db.select().from(listingsTable).limit(1);
  if (existing.length > 0) {
    console.log("Listings already exist. Skipping seed.");
    process.exit(0);
  }

  for (const listing of SAMPLE_LISTINGS) {
    await db.insert(listingsTable).values(listing);
    console.log(`Inserted: ${listing.year} ${listing.make} ${listing.model}`);
  }

  console.log(`\nSeeded ${SAMPLE_LISTINGS.length} listings successfully.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

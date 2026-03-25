export interface MockUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  email: string;
}

export interface MockListing {
  id: string;
  sellerId: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: string;
  condition: "excellent" | "good" | "fair" | "poor";
  description: string;
  location: string;
  images: string[];
  status: "active" | "sold" | "deleted";
  transmission: "automatic" | "manual" | null;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | null;
  color: string | null;
  bodyType: string | null;
  vin: string | null;
  vehicleType: "car" | "motorcycle" | "truck" | "van" | "suv" | "rv" | "boat" | "other";
  createdAt: string;
  updatedAt: string;
}

export interface MockInquiry {
  id: string;
  listingId: string;
  senderId: string;
  message: string;
  contactEmail: string;
  contactPhone: string | null;
  createdAt: string;
}

export interface MockConversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export const CURRENT_USER: MockUser = {
  id: "user-me",
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  email: "john@example.com",
};

export const OTHER_USERS: MockUser[] = [
  {
    id: "user-jane",
    username: "jansmith",
    firstName: "Jane",
    lastName: "Smith",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    email: "jane@example.com",
  },
  {
    id: "user-bob",
    username: "bobjohnson",
    firstName: "Bob",
    lastName: "Johnson",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    email: "bob@example.com",
  },
  {
    id: "user-alice",
    username: "alicew",
    firstName: "Alice",
    lastName: "Wang",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    email: "alice@example.com",
  },
];

export const INITIAL_LISTINGS: MockListing[] = [
  {
    id: "lst-001",
    sellerId: "user-jane",
    make: "Subaru",
    model: "Outback",
    year: 2021,
    mileage: 29000,
    price: "28500",
    condition: "excellent",
    description: "One-owner Subaru Outback in excellent condition. All-wheel drive, heated seats, sunroof, Apple CarPlay. Recently serviced with new brakes and tires. Perfect for mountain adventures or daily commuting.",
    location: "Portland, OR",
    images: ["https://images.unsplash.com/photo-1617531653332-bd46c16f7d5d?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Crystal White Pearl",
    bodyType: "Wagon",
    vin: "4S4BTACC5M3180023",
    vehicleType: "car",
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "lst-002",
    sellerId: "user-bob",
    make: "Honda",
    model: "CR-V",
    year: 2020,
    mileage: 41000,
    price: "26500",
    condition: "good",
    description: "Well-maintained Honda CR-V with low miles. Non-smoker vehicle, no accidents. Comes with all-season floor mats, cargo cover, and factory roof rack. Great family SUV.",
    location: "Denver, CO",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Sonic Gray Pearl",
    bodyType: "SUV",
    vin: "5J6RW2H85LH001423",
    vehicleType: "suv",
    createdAt: "2026-03-09T14:00:00Z",
    updatedAt: "2026-03-09T14:00:00Z",
  },
  {
    id: "lst-003",
    sellerId: "user-alice",
    make: "Jeep",
    model: "Wrangler",
    year: 2021,
    mileage: 22000,
    price: "42000",
    condition: "excellent",
    description: "Lifted Jeep Wrangler Unlimited Sport S with aftermarket wheels, skid plates, and LED light bar. 3.5\" lift kit, 35\" tires. Ready for any off-road adventure. Garage kept.",
    location: "Salt Lake City, UT",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Firecracker Red",
    bodyType: "SUV",
    vin: "1C4HJXDN0MW841235",
    vehicleType: "suv",
    createdAt: "2026-03-08T09:00:00Z",
    updatedAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "lst-004",
    sellerId: "user-jane",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    mileage: 18000,
    price: "38000",
    condition: "excellent",
    description: "Long Range Tesla Model 3 with Full Self-Driving package. Pearl White, black interior. Autopilot, premium audio, 19\" wheels. Supercharger network access. Home charger included.",
    location: "San Francisco, CA",
    images: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "electric",
    color: "Pearl White",
    bodyType: "Sedan",
    vin: "5YJ3E1EA9NF312876",
    vehicleType: "car",
    createdAt: "2026-03-07T11:00:00Z",
    updatedAt: "2026-03-07T11:00:00Z",
  },
  {
    id: "lst-005",
    sellerId: "user-bob",
    make: "Ford",
    model: "F-150",
    year: 2020,
    mileage: 55000,
    price: "34500",
    condition: "good",
    description: "Ford F-150 XLT SuperCrew 4x4. Tow package, backup camera, SYNC 3 infotainment. Bed liner, tonneau cover, running boards. Has been used for light towing only.",
    location: "Dallas, TX",
    images: ["https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Agate Black",
    bodyType: "Truck",
    vin: "1FTEW1EG5LFA12345",
    vehicleType: "truck",
    createdAt: "2026-03-06T16:00:00Z",
    updatedAt: "2026-03-06T16:00:00Z",
  },
  {
    id: "lst-006",
    sellerId: "user-alice",
    make: "BMW",
    model: "3 Series",
    year: 2019,
    mileage: 48000,
    price: "31000",
    condition: "good",
    description: "BMW 330i with M Sport package. Shadow Line trim, panoramic sunroof, heated seats, premium sound. All service records available. Recent 50k service completed.",
    location: "Chicago, IL",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Alpine White",
    bodyType: "Sedan",
    vin: "WBA5R1C50KAE82156",
    vehicleType: "car",
    createdAt: "2026-03-05T13:00:00Z",
    updatedAt: "2026-03-05T13:00:00Z",
  },
  {
    id: "lst-007",
    sellerId: "user-jane",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    mileage: 33000,
    price: "24500",
    condition: "excellent",
    description: "Toyota Camry SE with sport package. Blind spot monitoring, lane departure warning, adaptive cruise control. One owner, clean title, non-smoker.",
    location: "Atlanta, GA",
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Midnight Black Metallic",
    bodyType: "Sedan",
    vin: "4T1G11AK0MU321456",
    vehicleType: "car",
    createdAt: "2026-03-04T10:00:00Z",
    updatedAt: "2026-03-04T10:00:00Z",
  },
  {
    id: "lst-008",
    sellerId: "user-bob",
    make: "Kawasaki",
    model: "Ninja 650",
    year: 2022,
    mileage: 5200,
    price: "7800",
    condition: "excellent",
    description: "Low mileage Kawasaki Ninja 650 in excellent condition. Perfect beginner to intermediate sport bike. Comes with tank bag, handguards, and extra set of OEM mirrors.",
    location: "Miami, FL",
    images: ["https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80"],
    status: "active",
    transmission: "manual",
    fuelType: "gasoline",
    color: "Lime Green",
    bodyType: null,
    vin: "JKABXFF11NDA12345",
    vehicleType: "motorcycle",
    createdAt: "2026-03-03T08:00:00Z",
    updatedAt: "2026-03-03T08:00:00Z",
  },
  {
    id: "lst-009",
    sellerId: CURRENT_USER.id,
    make: "Toyota",
    model: "Tacoma",
    year: 2020,
    mileage: 38000,
    price: "32000",
    condition: "good",
    description: "Double Cab TRD Off-Road with 4WD. Crawl control, locking rear differential, skid plates. Perfect overlanding setup. Aftermarket roof rack and Bilstein shocks.",
    location: "Seattle, WA",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Army Green",
    bodyType: "Truck",
    vin: "3TMCZ5AN7LM321987",
    vehicleType: "truck",
    createdAt: "2026-03-02T12:00:00Z",
    updatedAt: "2026-03-02T12:00:00Z",
  },
  {
    id: "lst-010",
    sellerId: CURRENT_USER.id,
    make: "Mazda",
    model: "MX-5 Miata",
    year: 2019,
    mileage: 21000,
    price: "22000",
    condition: "excellent",
    description: "Fun and sporty Mazda MX-5 RF (retractable hardtop). Grand Touring trim with Brembo brakes and recaro seats. Perfect weekend driver or autocross car.",
    location: "Seattle, WA",
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"],
    status: "active",
    transmission: "manual",
    fuelType: "gasoline",
    color: "Machine Gray Metallic",
    bodyType: "Convertible",
    vin: "JM1NDAM70K0310234",
    vehicleType: "car",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "lst-011",
    sellerId: CURRENT_USER.id,
    make: "Honda",
    model: "Civic",
    year: 2018,
    mileage: 62000,
    price: "16500",
    condition: "good",
    description: "Reliable daily driver Honda Civic EX. New tires and brakes. Sunroof, Honda Sensing safety suite, Apple CarPlay. Great fuel economy — averaging 35 MPG.",
    location: "Seattle, WA",
    images: ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"],
    status: "sold",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Lunar Silver Metallic",
    bodyType: "Sedan",
    vin: "2HGFC2F72JH514321",
    vehicleType: "car",
    createdAt: "2026-02-20T14:00:00Z",
    updatedAt: "2026-02-28T10:00:00Z",
  },
  {
    id: "lst-012",
    sellerId: "user-alice",
    make: "Audi",
    model: "Q5",
    year: 2021,
    mileage: 26000,
    price: "44000",
    condition: "excellent",
    description: "Audi Q5 Premium Plus with Virtual Cockpit, Bang & Olufsen 3D sound, panoramic moonroof, and 21\" wheels. Audi Care prepaid maintenance included through 2027.",
    location: "Boston, MA",
    images: ["https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80"],
    status: "active",
    transmission: "automatic",
    fuelType: "gasoline",
    color: "Navarra Blue Metallic",
    bodyType: "SUV",
    vin: "WA1BNAFY7M2024567",
    vehicleType: "suv",
    createdAt: "2026-02-25T10:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },
];

export const INITIAL_INQUIRIES: MockInquiry[] = [
  {
    id: "inq-001",
    listingId: "lst-009",
    senderId: "user-bob",
    message: "Hi! Is the Tacoma still available? Would it be possible to see it this weekend?",
    contactEmail: "bob@example.com",
    contactPhone: "555-0101",
    createdAt: "2026-03-20T14:30:00Z",
  },
  {
    id: "inq-002",
    listingId: "lst-009",
    senderId: "user-alice",
    message: "Interested in the Tacoma. Does it have the factory tow package? What's the lowest you'd go?",
    contactEmail: "alice@example.com",
    contactPhone: null,
    createdAt: "2026-03-21T09:15:00Z",
  },
  {
    id: "inq-003",
    listingId: "lst-010",
    senderId: "user-jane",
    message: "Love the Miata! Has it ever been tracked? Any modifications besides what's listed?",
    contactEmail: "jane@example.com",
    contactPhone: "555-0202",
    createdAt: "2026-03-22T16:00:00Z",
  },
];

export const INITIAL_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv-001",
    listingId: "lst-001",
    buyerId: CURRENT_USER.id,
    sellerId: "user-jane",
    createdAt: "2026-03-18T10:00:00Z",
    updatedAt: "2026-03-22T11:00:00Z",
  },
  {
    id: "conv-002",
    listingId: "lst-009",
    buyerId: "user-bob",
    sellerId: CURRENT_USER.id,
    createdAt: "2026-03-20T14:30:00Z",
    updatedAt: "2026-03-21T09:00:00Z",
  },
];

export const INITIAL_MESSAGES: MockMessage[] = [
  {
    id: "msg-001",
    conversationId: "conv-001",
    senderId: CURRENT_USER.id,
    content: "Hi Jane! Is the Outback still available? I'm very interested.",
    readAt: "2026-03-18T10:30:00Z",
    createdAt: "2026-03-18T10:00:00Z",
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    senderId: "user-jane",
    content: "Yes it's still available! Would you like to come see it this weekend?",
    readAt: "2026-03-18T11:00:00Z",
    createdAt: "2026-03-18T10:30:00Z",
  },
  {
    id: "msg-003",
    conversationId: "conv-001",
    senderId: CURRENT_USER.id,
    content: "Saturday works great. Would 10am be okay?",
    readAt: null,
    createdAt: "2026-03-22T11:00:00Z",
  },
  {
    id: "msg-004",
    conversationId: "conv-002",
    senderId: "user-bob",
    content: "Hey! Love the Tacoma. Is the price negotiable?",
    readAt: "2026-03-20T15:00:00Z",
    createdAt: "2026-03-20T14:30:00Z",
  },
  {
    id: "msg-005",
    conversationId: "conv-002",
    senderId: CURRENT_USER.id,
    content: "There's a little room. What did you have in mind?",
    readAt: null,
    createdAt: "2026-03-21T09:00:00Z",
  },
];

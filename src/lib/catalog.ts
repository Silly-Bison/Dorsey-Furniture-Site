const DF = "https://dorseyfurniture.com/cdn/shop/files/";

export const LOGO = `${DF}logo-10.webp?v=1722282345&width=520`;
export const BANNERS = {
  clearance: `${DF}Dorsey_Furniture_Clearance_Sale_2026_1500x500_6366c647-b31f-493e-b685-a19245d7c75e.jpg?v=1793218199&width=2400`,
  priceMatch: `${DF}Dorsey_Price_Match_Guarantee_1500x500_af486142-06d3-4cef-99d4-13883d91b0ef.jpg?v=1751372726&width=2400`,
  delivery: `${DF}Dorsey_Furniture_Free_Delivery_1080x1080_72f81062-f110-41d5-8b0f-630d96b4e67c.jpg?v=1732378349&width=1200`,
};

export const STORE = {
  name: "Dorsey Furniture",
  phone: "(207) 843-7300",
  tel: "+12078437300",
  address: "1031 Main Rd, Holden, ME 04429",
  directions: "https://www.google.com/maps/dir/?api=1&destination=1031+Main+Rd+Holden+ME+04429",
};

// 0 = Sunday. [open, close] 24h. Placeholder hours — confirm with store.
export const HOURS: [number, number][] = [
  [12, 17], [9, 18], [9, 18], [9, 18], [9, 18], [9, 18], [9, 17],
];
export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type Category = { slug: string; name: string; subs: string[]; blurb: string };

export const CATEGORIES: Category[] = [
  { slug: "living-room", name: "Living Room", subs: ["Sofas & Couches", "Sectionals", "Power & Manual Recliners", "Accent Tables", "Entertainment Centers"], blurb: "Sofas, sectionals and recliners built for Maine winters." },
  { slug: "dining-room", name: "Dining Room Suites", subs: ["Dining Suites"], blurb: "Tables for every gathering." },
  { slug: "bedroom", name: "Bedroom", subs: ["Bedroom Sets"], blurb: "Complete bedroom collections." },
  { slug: "mattress-sleep", name: "Mattress & Sleep Center", subs: ["Dorsey Cooling", "Eastman House", "Glacier", "Purecare Bedding", "Adjustable Bases"], blurb: "Try every mattress in person before you buy." },
  { slug: "clearance", name: "Clearance & Specials", subs: ["50th Anniversary", "Floor Models"], blurb: "Anniversary pricing and floor-model savings." },
];

export const BRANDS: { name: string; note: string; logo?: string }[] = [
  { name: "Flexsteel", note: "3,500 sq ft dedicated showroom gallery", logo: `${DF}logo_d4757e86-d3e9-4b0b-933a-673e32b62eb6.svg?v=1722459582&width=720` },
  { name: "Craftmaster", note: "Custom-order upholstery" },
  { name: "Daniel's Amish", note: "Solid hardwood, handcrafted" },
  { name: "Barcalounger", note: "Classic recliners" },
  { name: "Liberty Furniture", note: "Dining and bedroom collections", logo: `${DF}liberty_Furniture-logo.png?v=1722460476&width=720` },
  { name: "Warehouse M", note: "Upholstery and lift chairs at honest prices" },
  { name: "Eastman House", note: "Mattresses", logo: `${DF}Eastman_House.png?v=1735742424&width=720` },
  { name: "Purecare", note: "Sleep accessories and protection", logo: `${DF}download.png?v=1722459542&width=720` },
];

import raw from "@/data/products.json";

// Real catalog imported from dorseyfurniture.com (products.json export).
export type Product = {
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  sub: string;
  images: string[];
  specs: [string, string][];
  description: string;
};

export const PRODUCTS = (raw as Product[]).map((p) => ({ ...p, image: p.images[0] }));
export type ShowroomProduct = (typeof PRODUCTS)[number];

export const findProduct = (slug: string) => PRODUCTS.find((x) => x.slug === slug);
export const categoryName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export function hoursStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", hour12: false }).formatToParts(now);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((x) => x.type === "weekday")!.value);
  const hr = Number(parts.find((x) => x.type === "hour")!.value) % 24;
  const [o, c] = HOURS[wd]!;
  const fmt = (h: number) => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;
  return hr >= o && hr < c
    ? { open: true, label: `Open now · until ${fmt(c)}` }
    : { open: false, label: `Closed · opens ${fmt(HOURS[hr >= c ? (wd + 1) % 7 : wd]![0])}` };
}

export function filterProducts(q: string, category?: string, brand?: string) {
  const s = q.trim().toLowerCase();
  return PRODUCTS.filter(
    (x) =>
      (!category || x.category === category) &&
      (!brand || x.brand === brand) &&
      (!s || [x.name, x.brand, x.sub, x.sku].join(" ").toLowerCase().includes(s)),
  );
}

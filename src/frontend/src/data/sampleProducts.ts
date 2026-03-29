export interface SampleProduct {
  id: number;
  name: string;
  description: string;
  priceInCents: number;
  category: string;
  imageUrl: string;
  inventoryCount: number;
  seller: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 1,
    name: "ProSound Wireless Headphones",
    description:
      "Premium noise-cancelling bluetooth headphones with 40-hour battery life. Experience studio-quality sound with deep bass and crystal-clear highs.",
    priceInCents: 12999,
    category: "Electronics",
    imageUrl: "/assets/generated/product-headphones.dim_400x400.jpg",
    inventoryCount: 50,
    seller: "TechStore Pro",
  },
  {
    id: 2,
    name: "Apex Running Jacket",
    description:
      "Lightweight water-resistant running jacket with reflective strips. Breathable mesh lining keeps you comfortable in any weather.",
    priceInCents: 8499,
    category: "Clothing",
    imageUrl: "/assets/generated/product-jacket.dim_400x400.jpg",
    inventoryCount: 75,
    seller: "SportGear Hub",
  },
  {
    id: 3,
    name: "Nordic Ceramic Coffee Mug",
    description:
      "Handcrafted ceramic mug with a modern minimalist design. Dishwasher safe, holds 14oz. Perfect for your morning ritual.",
    priceInCents: 2499,
    category: "Home & Garden",
    imageUrl: "/assets/generated/product-mug.dim_400x400.jpg",
    inventoryCount: 200,
    seller: "HomeStyle Co",
  },
  {
    id: 4,
    name: "TrailBlazer Water Bottle",
    description:
      "Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24 hours, hot 12 hours. BPA-free with leak-proof lid.",
    priceInCents: 3499,
    category: "Sports",
    imageUrl: "/assets/generated/product-bottle.dim_400x400.jpg",
    inventoryCount: 150,
    seller: "OutdoorLife",
  },
  {
    id: 5,
    name: "The Art of Selling — Business Guide",
    description:
      "A comprehensive guide to modern selling techniques, customer psychology, and building a thriving business in the digital age. Hardcover, 320 pages.",
    priceInCents: 1999,
    category: "Books",
    imageUrl: "/assets/generated/product-book.dim_400x400.jpg",
    inventoryCount: 500,
    seller: "PageTurner Books",
  },
  {
    id: 6,
    name: "Vortex Smart Watch",
    description:
      "Advanced fitness tracker with GPS, heart-rate monitor, and 7-day battery life. Compatible with iOS and Android. Sleep tracking included.",
    priceInCents: 19999,
    category: "Electronics",
    imageUrl: "/assets/generated/product-watch.dim_400x400.jpg",
    inventoryCount: 35,
    seller: "TechStore Pro",
  },
];

export const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
];

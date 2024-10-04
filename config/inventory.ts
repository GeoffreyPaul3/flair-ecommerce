import { Image } from "sanity";

interface InventoryProduct {
  id: string;
  name: string;
  slug: string; 
  images: Image[];
  categories: string[];
  availability: string;
  validityPeriod: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
}

export interface SanityProduct extends Omit<InventoryProduct, "images"> {
  _id: string;
  _createdAt: Date;
  slug: string;
  images: Image[];
}

export const inventory: InventoryProduct[] = [
  // Amazon Gift Card
  {
    id: "64da6006-a4bb-4555-af78-3467853eb761",
    sku: "gift_card_amazon",
    name: "Amazon Gift Card",
    slug: "amazon-gift-card",
    description: "Shop for millions of products worldwide on Amazon with the Amazon Gift Card. Whether it's electronics, books, or fashion, Amazon has it all. This gift card is accepted globally, making it a perfect gift for anyone, anywhere.",
    price: 2500, // Price in cents
    images: [
      { _type: "image", asset: { _ref: "card1", _type: "reference" } }
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },

  // Shein Gift Card
  {
    id: "64da6006-a4bb-4555-af78-3467853eb762",
    sku: "gift_card_shein",
    name: "Shein Gift Card",
    slug: "shein-gift-card",
    description: "Stay stylish with the Shein Gift Card, a perfect choice for fashion enthusiasts. Redeemable globally on Shein’s website, it offers a wide variety of trendy and affordable clothing, making shopping easy and accessible around the world.",
    price: 5000, // Price in cents
    images: [
      { _type: "image", asset: { _ref: "card2", _type: "reference" } }
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },

  // Apple Store Gift Card
  {
    id: "64da6006-a4bb-4555-af78-3467853eb763",
    sku: "gift_card_apple",
    name: "Apple Store Gift Card",
    slug: "apple-store-gift-card",
    description: "Unlock the world of Apple products with the Apple Store Gift Card. Whether it’s the latest iPhone, iPad, or MacBook, this gift card can be used globally in Apple Stores and online for a wide range of products and accessories.",
    price: 10000, // Price in cents
    images: [
      { _type: "image", asset: { _ref: "card3", _type: "reference" } }
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },

  // eBay Gift Card
  {
    id: "64da6006-a4bb-4555-af78-3467853eb764",
    sku: "gift_card_ebay",
    name: "eBay Gift Card",
    slug: "ebay-gift-card",
    description: "Discover rare finds and great deals with the eBay Gift Card. Redeemable worldwide, it allows you to bid or buy from a massive range of categories, from fashion to electronics. Perfect for the global shopper looking for variety.",
    price: 5000, // Price in cents
    images: [
      { _type: "image", asset: { _ref: "card4", _type: "reference" } }
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },

  // Etsy Gift Card
  {
    id: "64da6006-a4bb-4555-af78-3467853eb765",
    sku: "gift_card_etsy",
    name: "Etsy Gift Card",
    slug: "etsy-gift-card",
    description: "Explore unique and handcrafted goods with the Etsy Gift Card. Support independent creators and small businesses globally, offering custom-made items, vintage goods, and much more. Available to use worldwide.",
    price: 3000, // Price in cents
    images: [
      { _type: "image", asset: { _ref: "card5", _type: "reference" } }
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },

  // AliExpress Gift Card
  {
    id: "64da6006-a4bb-4555-af78-3467853eb766",
    sku: "gift_card_aliexpress",
    name: "AliExpress Gift Card",
    slug: "aliexpress-gift-card",
    description: "Enjoy shopping on one of the world’s largest marketplaces with the AliExpress Gift Card. With millions of products at unbeatable prices, this gift card is redeemable globally, making it a fantastic option for international shoppers.",
    price: 1500, // Price in cents
    images: [
      { _type: "image", asset: { _ref: "card6", _type: "reference" } }
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },

  // Spotify Gift Card
  {
    id: "64da6006-a4bb-4555-af78-3467853eb767",
    sku: "gift_card_spotify",
    name: "Spotify Gift Card",
    slug: "spotify-gift-card",
    description: "Unlock millions of songs, podcasts, and playlists with the Spotify Gift Card. This card works globally, providing premium access to Spotify’s ad-free music streaming, no matter where you are in the world.",
    price: 4000, // Price in cents
    images: [
      { _type: "image", asset: { _ref: "card7", _type: "reference" } }
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  }
  
  // Additional gift cards can be added following this structure
];


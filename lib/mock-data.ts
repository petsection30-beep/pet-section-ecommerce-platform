import type { Product } from "@/components/store/ProductCard"

export type ProductWithSlug = Product & { slug: string }

export const ALL_PRODUCTS: ProductWithSlug[] = [
  { id: "p1",  slug: "royal-canin-adult-dog-food-3kg",    name: "Royal Canin Adult Dog Food 3kg",   category: "Dog Food",         price: 3500, comparePrice: 4200, emoji: "🐕", gradient: "from-orange-50 to-orange-100",   inStock: true,  rating: 4.8, reviewCount: 124 },
  { id: "p2",  slug: "whiskas-tuna-cat-food-12-pack",      name: "Whiskas Tuna Cat Food — 12 Pack",  category: "Cat Food",         price: 1200, comparePrice: 1500, emoji: "🐈", gradient: "from-purple-50 to-purple-100",   inStock: true,  rating: 4.6, reviewCount: 89  },
  { id: "p3",  slug: "premium-bird-seed-mix-2kg",          name: "Premium Bird Seed Mix 2kg",        category: "Bird Food",        price: 850,                     emoji: "🦜", gradient: "from-green-50 to-green-100",     inStock: true,  rating: 4.5, reviewCount: 42  },
  { id: "p4",  slug: "aquarium-led-strip-light-60cm",      name: "Aquarium LED Strip Light 60cm",    category: "Aquarium",         price: 2200, comparePrice: 2800, emoji: "🐠", gradient: "from-blue-50 to-blue-100",       inStock: true,  rating: 4.7, reviewCount: 67  },
  { id: "p5",  slug: "orthopedic-dog-bed-large",           name: "Orthopedic Dog Bed Large",         category: "Dog Accessories",  price: 4500,                    emoji: "🛏️", gradient: "from-rose-50 to-rose-100",       inStock: true,  rating: 4.7, reviewCount: 28  },
  { id: "p6",  slug: "interactive-cat-toy-set",            name: "Interactive Cat Toy Set",          category: "Cat Toys",         price: 890,  comparePrice: 1100, emoji: "🧶", gradient: "from-violet-50 to-violet-100",   inStock: true,  rating: 4.5, reviewCount: 19  },
  { id: "p7",  slug: "stainless-steel-pet-bowl-set",       name: "Stainless Steel Pet Bowl Set",     category: "Accessories",      price: 450,                     emoji: "🥣", gradient: "from-sky-50 to-sky-100",         inStock: true,  rating: 4.8, reviewCount: 63  },
  { id: "p8",  slug: "hamster-running-wheel-21cm",         name: "Hamster Running Wheel 21cm",       category: "Small Pets",       price: 1200, comparePrice: 1500, emoji: "🐹", gradient: "from-lime-50 to-lime-100",       inStock: true,  rating: 4.3, reviewCount: 15  },
  { id: "p9",  slug: "cat-scratching-post-tower",          name: "Cat Scratching Post Tower",        category: "Cat Accessories",  price: 3200,                    emoji: "🏰", gradient: "from-fuchsia-50 to-fuchsia-100", inStock: true,  rating: 4.6, reviewCount: 47  },
  { id: "p10", slug: "parrot-cage-premium-xl",             name: "Parrot Cage Premium XL",           category: "Bird Accessories", price: 8500, comparePrice: 9500, emoji: "🦅", gradient: "from-emerald-50 to-emerald-100", inStock: false, rating: 4.4, reviewCount: 22  },
  { id: "p11", slug: "dog-training-clicker-kit",           name: "Dog Training Clicker Kit",         category: "Dog Training",     price: 750,                     emoji: "🎯", gradient: "from-yellow-50 to-yellow-100",   inStock: true,  rating: 4.7, reviewCount: 91  },
  { id: "p12", slug: "aquarium-canister-filter-pump",      name: "Aquarium Canister Filter Pump",    category: "Aquarium",         price: 2800, comparePrice: 3200, emoji: "💧", gradient: "from-cyan-50 to-cyan-100",       inStock: true,  rating: 4.5, reviewCount: 38  },
  { id: "p13", slug: "dog-grooming-kit-8-piece",           name: "Dog Grooming Kit 8-Piece",         category: "Grooming",         price: 1800, comparePrice: 2200, emoji: "✂️", gradient: "from-pink-50 to-pink-100",       inStock: true,  rating: 4.4, reviewCount: 33  },
  { id: "p14", slug: "genuine-leather-dog-leash",          name: "Genuine Leather Dog Leash",        category: "Dog Accessories",  price: 650,                     emoji: "🦮", gradient: "from-amber-50 to-amber-100",     inStock: true,  rating: 4.9, reviewCount: 156 },
  { id: "p15", slug: "soft-pet-carrier-bag",               name: "Soft Pet Carrier Bag",             category: "Cat Accessories",  price: 2500, comparePrice: 3000, emoji: "👜", gradient: "from-indigo-50 to-indigo-100",   inStock: true,  rating: 4.6, reviewCount: 44  },
  { id: "p16", slug: "tetra-fish-food-flakes-200g",        name: "Tetra Fish Food Flakes 200g",      category: "Aquarium",         price: 480,                     emoji: "🐟", gradient: "from-teal-50 to-teal-100",       inStock: true,  rating: 4.3, reviewCount: 29  },
]

export const CATEGORIES_LIST = [
  "All",
  "Dog Food", "Cat Food", "Bird Food",
  "Dog Accessories", "Cat Accessories", "Bird Accessories",
  "Dog Training", "Cat Toys",
  "Aquarium", "Grooming", "Accessories", "Small Pets",
]

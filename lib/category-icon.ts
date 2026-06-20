// Maps a category name to a matching emoji icon via keyword detection, so a
// category's icon always reflects its name. Used by the admin category form
// (auto-fill) and the create API (fallback). Order matters — more specific
// rules come first; the first keyword hit wins.
const ICON_RULES: { keywords: string[]; icon: string }[] = [
  { keywords: ["dog", "puppy", "canine"],                                   icon: "🐕" },
  { keywords: ["cat", "kitten", "feline"],                                  icon: "🐈" },
  { keywords: ["bird", "parrot", "budgie", "cockatiel", "avian"],           icon: "🦜" },
  { keywords: ["fish", "aquarium", "aquatic", "marine", "tank", "pond"],    icon: "🐠" },
  { keywords: ["rabbit", "bunny"],                                          icon: "🐇" },
  { keywords: ["hamster", "guinea", "gerbil", "mouse", "rodent", "small pet"], icon: "🐹" },
  { keywords: ["reptile", "snake", "lizard", "turtle", "tortoise", "gecko"], icon: "🦎" },
  { keywords: ["horse", "pony", "equine"],                                  icon: "🐴" },
  { keywords: ["toy", "play", "chew"],                                      icon: "🧸" },
  { keywords: ["food", "treat", "feed", "nutrition", "snack", "kibble"],    icon: "🍖" },
  { keywords: ["groom", "brush", "shampoo", "nail", "trim"],               icon: "🧴" },
  { keywords: ["bed", "mat", "cushion", "sleep", "blanket"],               icon: "🛏️" },
  { keywords: ["leash", "collar", "harness", "lead"],                       icon: "🦮" },
  { keywords: ["cage", "kennel", "crate", "hutch", "carrier"],             icon: "🏠" },
  { keywords: ["bowl", "feeder", "dish", "drink", "water"],                icon: "🥣" },
  { keywords: ["health", "medicine", "medical", "supplement", "vitamin", "wellness", "care"], icon: "💊" },
  { keywords: ["cloth", "apparel", "wear", "costume", "sweater", "jacket", "fashion"], icon: "👕" },
  { keywords: ["train", "clicker"],                                         icon: "🎯" },
  { keywords: ["litter", "potty", "clean", "hygiene", "waste", "poop"],    icon: "🧹" },
  { keywords: ["accessor", "gear", "supplies", "supply", "essential"],     icon: "🛍️" },
]

const DEFAULT_ICON = "🐾"

export function categoryIcon(name: string): string {
  const n = name.toLowerCase()
  for (const rule of ICON_RULES) {
    if (rule.keywords.some(k => n.includes(k))) return rule.icon
  }
  return DEFAULT_ICON
}

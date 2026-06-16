// Visual presets for hero slides. The DB stores only the preset `key`
// (e.g. "navy"); the Tailwind classes live here so they survive purging
// and stay editable in code. Admin picks a key from this list.

export type HeroTheme = {
  key:     string
  label:   string
  bg:      string
  blob1:   string
  blob2:   string
  accent:  string   // text-* colour for the highlight + dot
  badgeBg: string
  emojis:  { e: string; cls: string }[]
}

export const HERO_THEMES: HeroTheme[] = [
  {
    key: "navy", label: "Navy",
    bg:      "from-[#1E3A5F] via-[#162d4a] to-[#0f1f35]",
    blob1:   "bg-orange-500/15", blob2: "bg-orange-400/8",
    accent:  "text-orange-400",
    badgeBg: "bg-orange-500/20 border-orange-500/30 text-orange-400",
    emojis: [
      { e: "🐕", cls: "top-[12%] left-[8%]  text-5xl opacity-20  rotate-12   hidden sm:block" },
      { e: "🐈", cls: "top-[20%] right-[6%] text-6xl opacity-10  -rotate-6   hidden sm:block" },
      { e: "🐠", cls: "bottom-[18%] left-[12%] text-4xl opacity-15  rotate-3  hidden md:block" },
      { e: "🦜", cls: "bottom-[12%] right-[10%] text-3xl opacity-20 -rotate-12 hidden md:block" },
    ],
  },
  {
    key: "orange", label: "Sunset Orange",
    bg:      "from-[#7c2d12] via-[#9a3412] to-[#c2410c]",
    blob1:   "bg-yellow-400/20", blob2: "bg-red-400/10",
    accent:  "text-yellow-300",
    badgeBg: "bg-yellow-400/20 border-yellow-400/30 text-yellow-300",
    emojis: [
      { e: "☀️", cls: "top-[10%] left-[6%]   text-5xl opacity-25  rotate-12  hidden sm:block" },
      { e: "🦴", cls: "top-[22%] right-[7%]  text-4xl opacity-20  -rotate-6  hidden sm:block" },
      { e: "🐾", cls: "bottom-[20%] left-[10%] text-3xl opacity-20 rotate-12  hidden md:block" },
      { e: "🎁", cls: "bottom-[14%] right-[8%] text-4xl opacity-20 -rotate-6  hidden md:block" },
    ],
  },
  {
    key: "cyan", label: "Ocean Cyan",
    bg:      "from-[#1e3a5f] via-[#1d4e6a] to-[#155e75]",
    blob1:   "bg-cyan-400/15", blob2: "bg-teal-400/10",
    accent:  "text-cyan-300",
    badgeBg: "bg-cyan-400/20 border-cyan-400/30 text-cyan-300",
    emojis: [
      { e: "🐟", cls: "top-[14%] left-[7%]    text-5xl opacity-20  rotate-6   hidden sm:block" },
      { e: "🧶", cls: "top-[18%] right-[8%]   text-5xl opacity-15  -rotate-12 hidden sm:block" },
      { e: "🐠", cls: "bottom-[16%] left-[11%] text-4xl opacity-20  rotate-3   hidden md:block" },
      { e: "🐾", cls: "bottom-[10%] right-[9%] text-3xl opacity-15 -rotate-6  hidden md:block" },
    ],
  },
  {
    key: "green", label: "Forest Green",
    bg:      "from-[#14532d] via-[#166534] to-[#15803d]",
    blob1:   "bg-green-300/15", blob2: "bg-emerald-400/10",
    accent:  "text-green-300",
    badgeBg: "bg-green-400/20 border-green-400/30 text-green-300",
    emojis: [
      { e: "🚀", cls: "top-[12%] left-[6%]    text-5xl opacity-20  rotate-12  hidden sm:block" },
      { e: "📦", cls: "top-[20%] right-[6%]   text-5xl opacity-15  -rotate-6  hidden sm:block" },
      { e: "🐕", cls: "bottom-[20%] left-[10%] text-4xl opacity-20  rotate-3   hidden md:block" },
      { e: "🐾", cls: "bottom-[12%] right-[9%] text-3xl opacity-20 -rotate-12 hidden md:block" },
    ],
  },
]

export const DEFAULT_THEME = HERO_THEMES[0]

export function getHeroTheme(key: string): HeroTheme {
  return HERO_THEMES.find(t => t.key === key) ?? DEFAULT_THEME
}

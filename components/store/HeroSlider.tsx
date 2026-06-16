import { prisma } from "@/lib/prisma"
import HeroSliderClient, { type HeroSlideData } from "./HeroSliderClient"

export default async function HeroSlider() {
  let slides: HeroSlideData[] = []
  try {
    const rows = await prisma.heroSlide.findMany({
      where:   { isActive: true },
      orderBy: { order: "asc" },
    })
    slides = rows.map(s => ({
      id: s.id, badge: s.badge, headline: s.headline, highlight: s.highlight,
      subtitle: s.subtitle, cta1Label: s.cta1Label, cta1Href: s.cta1Href,
      cta2Label: s.cta2Label, cta2Href: s.cta2Href, theme: s.theme,
    }))
  } catch {
    slides = []
  }

  return <HeroSliderClient slides={slides} />
}

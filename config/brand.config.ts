export type BrandConfig = {
  storeName: string
  storeTagline: string
  storeDescription: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  surfaceColor: string
  mutedColor: string
  fontFamily: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    instagram?: string
    facebook?: string
    tiktok?: string
  }
  codEnabled: boolean
  easypaisaEnabled: boolean
  easypaisaTitle: string
  easypaisaNumber: string
  jazzcashEnabled: boolean
  jazzcashTitle: string
  jazzcashNumber: string
  currency: string
  currencySymbol: string
  metaKeywords: string
}

const brand: BrandConfig = {
  storeName:        "PawsPoint",
  storeTagline:     "Everything Your Pet Deserves",
  storeDescription: "Pakistan's #1 online pet store — dogs, cats, birds & more.",

  primaryColor:   "#F97316",
  secondaryColor: "#1E3A5F",
  accentColor:    "#FEF3C7",
  backgroundColor:"#F8FAFC",
  surfaceColor:   "#FFFFFF",
  mutedColor:     "#6B7280",
  fontFamily:     "Poppins",

  contactEmail: "hello@pawspoint.pk",
  contactPhone: "+92 300 0000000",
  address:      "Islamabad, Pakistan",

  socialLinks: {
    instagram: "https://instagram.com/pawspoint",
    facebook:  "https://facebook.com/pawspoint",
  },

  codEnabled:       true,
  easypaisaEnabled: true,
  easypaisaTitle:   "PawsPoint Store",
  easypaisaNumber:  "0300-1234567",
  jazzcashEnabled:  true,
  jazzcashTitle:    "PawsPoint Store",
  jazzcashNumber:   "0320-7654321",

  currency:       "PKR",
  currencySymbol: "₨",

  metaKeywords: "pet store pakistan, dog food, cat food, bird cage, fish aquarium",
}

export default brand

import { prisma } from "@/lib/prisma"
import brand from "@/config/brand.config"

// Merged store settings: DB overrides (admin-editable) on top of the
// code-based brand defaults. Colours/fonts/logo stay in brand.config
// (white-label, code-driven); text/contact/payments come from the DB.
export type StoreSettings = {
  storeName: string
  storeTagline: string
  storeDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: { instagram?: string; facebook?: string; tiktok?: string; whatsapp?: string }
  codEnabled: boolean
  easypaisaEnabled: boolean
  easypaisaTitle: string
  easypaisaNumber: string
  nayapayEnabled: boolean
  nayapayTitle: string
  nayapayNumber: string
  bankTransferEnabled: boolean
  bankName: string
  bankAccountTitle: string
  bankAccountNumber: string
  bankIban: string
  deliveryFee: number
  freeDeliveryEnabled: boolean
  freeDeliveryThreshold: number
}

function pick(value: string | null | undefined, fallback: string): string {
  return value != null && value !== "" ? value : fallback
}

export async function getSettings(): Promise<StoreSettings> {
  let row: Awaited<ReturnType<typeof prisma.siteSetting.findUnique>> = null
  try {
    row = await prisma.siteSetting.findUnique({ where: { id: "singleton" } })
  } catch {
    // DB unreachable — fall back to brand defaults
  }

  return {
    storeName:        pick(row?.storeName, brand.storeName),
    storeTagline:     pick(row?.storeTagline, brand.storeTagline),
    storeDescription: pick(row?.storeDescription, brand.storeDescription),
    contactEmail:     pick(row?.contactEmail, brand.contactEmail),
    contactPhone:     pick(row?.contactPhone, brand.contactPhone),
    address:          pick(row?.address, brand.address),
    socialLinks: {
      instagram: pick(row?.instagram, brand.socialLinks.instagram ?? ""),
      facebook:  pick(row?.facebook,  brand.socialLinks.facebook ?? ""),
      tiktok:    pick(row?.tiktok,    brand.socialLinks.tiktok ?? ""),
      whatsapp:  pick(row?.whatsapp,  brand.socialLinks.whatsapp ?? ""),
    },
    codEnabled:          row?.codEnabled ?? brand.codEnabled,
    easypaisaEnabled:    row?.easypaisaEnabled ?? brand.easypaisaEnabled,
    easypaisaTitle:      pick(row?.easypaisaTitle, brand.easypaisaTitle),
    easypaisaNumber:     pick(row?.easypaisaNumber, brand.easypaisaNumber),
    nayapayEnabled:      row?.nayapayEnabled ?? brand.nayapayEnabled,
    nayapayTitle:        pick(row?.nayapayTitle, brand.nayapayTitle),
    nayapayNumber:       pick(row?.nayapayNumber, brand.nayapayNumber),
    bankTransferEnabled: row?.bankTransferEnabled ?? brand.bankTransferEnabled,
    bankName:            pick(row?.bankName, brand.bankName),
    bankAccountTitle:    pick(row?.bankAccountTitle, brand.bankAccountTitle),
    bankAccountNumber:   pick(row?.bankAccountNumber, brand.bankAccountNumber),
    bankIban:            pick(row?.bankIban, brand.bankIban),
    deliveryFee:           row?.deliveryFee ?? brand.deliveryFee,
    freeDeliveryEnabled:   row?.freeDeliveryEnabled ?? brand.freeDeliveryEnabled,
    freeDeliveryThreshold: row?.freeDeliveryThreshold ?? brand.freeDeliveryThreshold,
  }
}

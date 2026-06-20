// Shared order-status presentation logic used by checkout, order tracking,
// account pages, and admin. Mirrors the OrderStatus enum in schema.prisma.

export type OrderStatus =
  | "PENDING_COD" | "PENDING_VERIFICATION" | "CONFIRMED"
  | "SHIPPED"     | "DELIVERED"            | "REJECTED" | "CANCELLED"

export type PaymentMethod = "COD" | "EASYPAISA" | "NAYAPAY" | "BANK_TRANSFER"

export const STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  PENDING_COD:          { label: "Pending (COD)",        badge: "text-warning bg-warning/10" },
  PENDING_VERIFICATION: { label: "Pending Verification", badge: "text-warning bg-warning/10" },
  CONFIRMED:            { label: "Confirmed",            badge: "text-primary bg-primary/10" },
  SHIPPED:              { label: "Shipped",              badge: "text-primary bg-primary/10" },
  DELIVERED:            { label: "Delivered",            badge: "text-success bg-success/10" },
  REJECTED:             { label: "Rejected",             badge: "text-danger bg-danger/10" },
  CANCELLED:            { label: "Cancelled",            badge: "text-gray-500 bg-gray-100" },
}

export function statusLabel(status: OrderStatus): string {
  return STATUS_META[status]?.label ?? status
}

export function statusBadge(status: OrderStatus): string {
  return STATUS_META[status]?.badge ?? "text-gray-500 bg-gray-100"
}

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  COD:           "Cash on Delivery",
  EASYPAISA:     "EasyPaisa",
  NAYAPAY:       "NayaPay",
  BANK_TRANSFER: "Bank Transfer",
}

export type TimelineStep = { label: string; state: "done" | "active" | "pending" }

export function buildTimeline(status: OrderStatus, paymentMethod: PaymentMethod): TimelineStep[] {
  if (status === "CANCELLED") {
    return [
      { label: "Order Placed", state: "done" },
      { label: "Cancelled",    state: "active" },
    ]
  }

  const isWallet = paymentMethod !== "COD"

  if (status === "REJECTED") {
    return [
      { label: "Order Placed",    state: "done" },
      { label: "Payment Rejected", state: "active" },
    ]
  }

  const stages = isWallet
    ? ["Order Placed", "Payment Verification", "Confirmed & Processing", "Shipped", "Delivered"]
    : ["Order Placed", "Confirmed & Processing", "Shipped", "Delivered"]

  // The index currently "active"; everything before it is done.
  // A value beyond the last index means every stage is complete (DELIVERED).
  const walletIdx: Record<string, number> = { PENDING_VERIFICATION: 1, CONFIRMED: 2, SHIPPED: 3, DELIVERED: 5 }
  const codIdx:    Record<string, number> = { PENDING_COD: 1, CONFIRMED: 2, SHIPPED: 3, DELIVERED: 4 }
  const activeIdx = (isWallet ? walletIdx : codIdx)[status] ?? 1

  return stages.map((label, i) => ({
    label,
    state: i < activeIdx ? "done" : i === activeIdx ? "active" : "pending",
  }))
}

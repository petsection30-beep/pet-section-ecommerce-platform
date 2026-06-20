// Pure, server-safe delivery-fee math shared by cart, checkout, the payment
// screen, and the orders API. No React/client imports here so it can be used
// inside server code (the orders route). The client hook that reads live admin
// settings lives in lib/useDeliveryConfig.ts.
export type DeliveryConfig = {
  deliveryFee: number
  freeDeliveryEnabled: boolean
  freeDeliveryThreshold: number
}

export function computeDeliveryFee(subtotal: number, c: DeliveryConfig): number {
  if (c.freeDeliveryEnabled && subtotal >= c.freeDeliveryThreshold) return 0
  return c.deliveryFee
}

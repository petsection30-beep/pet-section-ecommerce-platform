"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type CheckoutAddress = {
  fullName:   string
  phone:      string
  line1:      string
  line2:      string
  city:       string
  province:   string
  postalCode: string
}

type CheckoutState = {
  address:    CheckoutAddress | null
  setAddress: (address: CheckoutAddress) => void
  clear:      () => void
}

// Held in sessionStorage — the address only needs to survive the
// address → payment step transition, not a full browser restart.
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      clear: () => set({ address: null }),
    }),
    {
      name: "petsection-checkout",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? sessionStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
)

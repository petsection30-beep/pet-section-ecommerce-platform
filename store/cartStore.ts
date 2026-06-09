"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type CartItem = {
  id:          string  // product id
  slug:        string
  name:        string
  price:       number
  emoji:       string
  gradient:    string
  variantId?:  string
  variantName?: string
  qty:         number
}

type CartState = {
  items:      CartItem[]
  addItem:    (item: Omit<CartItem, "qty"> & { qty?: number }) => void
  removeItem: (id: string, variantId?: string) => void
  updateQty:  (id: string, qty: number, variantId?: string) => void
  clearCart:  () => void
  totalItems: () => number
  totalPrice: () => number
}

function itemKey(id: string, variantId?: string) {
  return `${id}__${variantId ?? ""}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const key = itemKey(product.id, product.variantId)
          const existing = state.items.find(
            (i) => itemKey(i.id, i.variantId) === key
          )
          const addQty = product.qty ?? 1
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.id, i.variantId) === key ? { ...i, qty: i.qty + addQty } : i
              ),
            }
          }
          return { items: [...state.items, { ...product, qty: addQty }] }
        }),

      removeItem: (id, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.id, i.variantId) !== itemKey(id, variantId)
          ),
        })),

      updateQty: (id, qty, variantId) =>
        set((state) => {
          const key = itemKey(id, variantId)
          if (qty <= 0) {
            return { items: state.items.filter((i) => itemKey(i.id, i.variantId) !== key) }
          }
          return {
            items: state.items.map((i) =>
              itemKey(i.id, i.variantId) === key ? { ...i, qty } : i
            ),
          }
        }),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),

      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    {
      name:    "pawspoint-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
)

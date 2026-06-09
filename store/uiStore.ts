"use client"

import { create } from "zustand"

type UiState = {
  cartOpen:      boolean
  searchOpen:    boolean
  mobileMenuOpen:boolean
  setCartOpen:   (v: boolean) => void
  setSearchOpen: (v: boolean) => void
  setMobileMenu: (v: boolean) => void
  toggleCart:    () => void
}

export const useUiStore = create<UiState>()((set, get) => ({
  cartOpen:       false,
  searchOpen:     false,
  mobileMenuOpen: false,
  setCartOpen:    (v)  => set({ cartOpen: v }),
  setSearchOpen:  (v)  => set({ searchOpen: v }),
  setMobileMenu:  (v)  => set({ mobileMenuOpen: v }),
  toggleCart:     ()   => set({ cartOpen: !get().cartOpen }),
}))

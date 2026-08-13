"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: number[];
  toggle: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
      isWishlisted: (id) => get().ids.includes(id),
      clearWishlist: () => set({ ids: [] }),
    }),
    { name: "unseen-gadget-wishlist" }
  )
);
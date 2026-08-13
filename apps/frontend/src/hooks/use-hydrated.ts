"use client";

import { useSyncExternalStore } from "react";

const emptySubscription = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscription,
    () => true,
    () => false
  );
}
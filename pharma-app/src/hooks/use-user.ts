"use client";

import { useSession } from "@/lib/auth-client";

/**
 * Convenience hook that wraps `useSession` and exposes a flattened user object.
 *
 * @returns `{ user, isLoading, isAuthenticated, error }`
 */
export function useUser() {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error: error ?? null,
  };
}

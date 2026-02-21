/**
 * Server-side session helper using better-auth.
 *
 * Import this in middleware or server components to get the current session
 * without importing the full auth configuration.
 */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Browser-side Supabase client used ONLY for authentication (sign up, log in, password reset).
 * The session lives in localStorage, not cookies, so it also works inside WhatsApp's in-app browser.
 * It uses the public anon key: every data table is locked to the server, so this key can't read any of them.
 */
export function authClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage: window.localStorage },
  });
  return client;
}

/** Bearer header for calling our own API routes as the signed-in user. */
export async function authHeader(): Promise<Record<string, string>> {
  const { data } = (await authClient()?.auth.getSession()) ?? { data: { session: null } };
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

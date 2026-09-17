import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Session-aware client for /account only — every other page in this app
// is deliberately capability-link based (see Milestone 6 plan). No
// middleware: a session just expires and the visitor requests a fresh
// magic link, which this MVP accepts as an acceptable tradeoff.
export async function createSupabaseSessionClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render, where cookies can't be
          // written — session establishment still works via
          // app/auth/callback/route.ts, where writes are allowed.
        }
      },
    },
  });
}

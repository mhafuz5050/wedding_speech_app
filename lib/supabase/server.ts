import "server-only";
import { createClient } from "@supabase/supabase-js";

// Uses the anon key, not the service role key: every table this touches
// is protected by RLS, so this client can only do what an anonymous
// visitor is allowed to do (e.g. insert into `waitlist`, nothing else).
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. Only ever used for the
// handful of privileged, server-only operations (creating the auth user,
// writing speeches/usage_limits/generation_logs). Never import this from
// a client component, and never expose SUPABASE_SERVICE_ROLE_KEY to the
// browser.
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

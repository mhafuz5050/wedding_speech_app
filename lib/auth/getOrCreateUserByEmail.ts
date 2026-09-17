import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Creates the Supabase auth user "in the background" (CLAUDE.md §3 step 4):
// the visitor never has to click a magic link before seeing their speech.
// We still trigger the real magic-link email, best-effort, for later login.
export async function getOrCreateUserByEmail(email: string): Promise<string> {
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (!error && data.user) {
    await admin
      .from("profiles")
      .upsert({ id: data.user.id, email }, { onConflict: "id" });
    sendMagicLinkBestEffort(email);
    return data.user.id;
  }

  // Already registered — profiles mirrors auth.users, so look the id up
  // there instead of relying on admin.listUsers()/getUserByEmail quirks.
  const { data: existing, error: lookupError } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError || !existing) {
    throw error ?? lookupError ?? new Error("Could not resolve user for email");
  }

  sendMagicLinkBestEffort(email);
  return existing.id as string;
}

function sendMagicLinkBestEffort(email: string) {
  const supabase = createSupabaseServerClient();
  supabase.auth.signInWithOtp({ email }).catch((err) => {
    console.error("Failed to send magic-link email", err);
  });
}

"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().toLowerCase().email();

export type MagicLinkResult = { ok: true } | { ok: false; error: string };

export async function requestMagicLink(
  _prev: MagicLinkResult | null,
  formData: FormData,
): Promise<MagicLinkResult> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: appUrl ? { emailRedirectTo: `${appUrl}/auth/callback` } : undefined,
  });

  if (error) {
    console.error("Failed to send account magic link", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}

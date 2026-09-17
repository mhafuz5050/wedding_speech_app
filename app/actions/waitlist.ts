"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().toLowerCase().email();

export type WaitlistResult =
  | { ok: true; alreadyJoined: boolean }
  | { ok: false; error: string };

export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData,
): Promise<WaitlistResult> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("waitlist")
    .insert({ email: parsed.data });

  if (error) {
    // Postgres unique_violation: they're already on the list, not an error.
    if (error.code === "23505") {
      return { ok: true, alreadyJoined: true };
    }
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true, alreadyJoined: false };
}

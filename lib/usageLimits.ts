import "server-only";
import { createHash } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// CLAUDE.md §7: "Max 2 free generations per email per day, and 5 per IP per day"
const MAX_PER_EMAIL_PER_DAY = 2;
const MAX_PER_IP_PER_DAY = 5;

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export type UsageLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "email" | "ip" };

export async function checkUsageLimit(params: {
  userId: string;
  ipHash: string;
}): Promise<UsageLimitResult> {
  const admin = createSupabaseAdminClient();
  const date = todayUtc();

  const [{ data: userRow }, { data: ipRow }] = await Promise.all([
    admin
      .from("usage_limits")
      .select("generations_count")
      .eq("user_id", params.userId)
      .eq("date", date)
      .maybeSingle(),
    admin
      .from("usage_limits")
      .select("generations_count")
      .eq("ip_hash", params.ipHash)
      .eq("date", date)
      .maybeSingle(),
  ]);

  if ((userRow?.generations_count ?? 0) >= MAX_PER_EMAIL_PER_DAY) {
    return { allowed: false, reason: "email" };
  }
  if ((ipRow?.generations_count ?? 0) >= MAX_PER_IP_PER_DAY) {
    return { allowed: false, reason: "ip" };
  }
  return { allowed: true };
}

// Called only after a generation succeeds, so failed attempts (e.g. the
// Anthropic call erroring) don't count against the visitor's daily limit.
export async function recordUsage(params: {
  userId: string;
  ipHash: string;
}): Promise<void> {
  const admin = createSupabaseAdminClient();
  const date = todayUtc();

  await Promise.all([
    bumpCounter(admin, { user_id: params.userId }, date),
    bumpCounter(admin, { ip_hash: params.ipHash }, date),
  ]);
}

async function bumpCounter(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  match: Record<string, string>,
  date: string,
) {
  const { data: existing } = await admin
    .from("usage_limits")
    .select("id, generations_count")
    .match({ ...match, date })
    .maybeSingle();

  if (existing) {
    await admin
      .from("usage_limits")
      .update({ generations_count: existing.generations_count + 1 })
      .eq("id", existing.id);
  } else {
    await admin
      .from("usage_limits")
      .insert({ ...match, date, generations_count: 1 });
  }
}

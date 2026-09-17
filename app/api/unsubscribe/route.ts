import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const querySchema = z.object({ userId: z.string().uuid() });

export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ userId: searchParams.get("userId") });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ marketing_opt_out: true })
    .eq("id", parsed.data.userId);

  if (error) {
    console.error("Failed to unsubscribe", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }

  return NextResponse.redirect(`${origin}/unsubscribed`);
}

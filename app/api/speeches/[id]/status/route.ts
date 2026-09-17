import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Returns only the status string — never speech content — so this is
// safe to poll from a Client Component.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!speech) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ status: speech.status });
}

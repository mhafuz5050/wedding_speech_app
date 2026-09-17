import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseSessionClient } from "@/lib/supabase/session";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/account`);
    }
    console.error("Failed to exchange auth code for session", error);
  }

  return NextResponse.redirect(`${origin}/account?error=auth_failed`);
}

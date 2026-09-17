import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createResendClient } from "@/lib/resend/client";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getSpeechType } from "@/lib/speechTypes";
import { EMAIL_FROM } from "@/lib/config";
import { followUpEmail } from "@/lib/emails/followUpEmail";

const BATCH_LIMIT = 50;
const MIN_AGE_MS = 24 * 60 * 60 * 1000;

// Triggered by a Vercel Cron Job (see vercel.json) — Vercel sends
// `Authorization: Bearer $CRON_SECRET` automatically when that env var
// is set. Anything else is refused.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("Missing NEXT_PUBLIC_APP_URL");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  const admin = createSupabaseAdminClient();
  const cutoff = new Date(Date.now() - MIN_AGE_MS).toISOString();

  const { data: speeches, error: queryError } = await admin
    .from("speeches")
    .select("id, user_id, speech_type, answers")
    .neq("status", "paid")
    .is("follow_up_sent_at", null)
    .lte("created_at", cutoff)
    .limit(BATCH_LIMIT);

  if (queryError) {
    console.error("Failed to query speeches for follow-up emails", queryError);
    return NextResponse.json({ error: "Query failed." }, { status: 500 });
  }

  if (!speeches || speeches.length === 0) {
    return NextResponse.json({ checked: 0, sent: 0 });
  }

  let sent = 0;

  for (const speech of speeches) {
    const { data: profile } = await admin
      .from("profiles")
      .select("email, marketing_opt_out")
      .eq("id", speech.user_id)
      .maybeSingle();

    if (!profile) {
      console.error("No profile for speech, skipping follow-up", speech.id);
      continue;
    }

    if (profile.marketing_opt_out) {
      // Never re-check an opted-out user on future runs.
      await admin
        .from("speeches")
        .update({ follow_up_sent_at: new Date().toISOString() })
        .eq("id", speech.id);
      continue;
    }

    const answers = questionnaireSchema.safeParse(speech.answers);
    const speechType = getSpeechType(speech.speech_type);
    const coupleNames = answers.success
      ? `${answers.data.partnerAName} & ${answers.data.partnerBName}`
      : "the happy couple";

    const { subject, html } = followUpEmail({
      speechTypeLabel: speechType?.label ?? "wedding",
      coupleNames,
      speechUrl: `${appUrl}/speech/${speech.id}`,
      unsubscribeUrl: `${appUrl}/api/unsubscribe?userId=${speech.user_id}`,
    });

    try {
      const resend = createResendClient();
      await resend.emails.send({ from: EMAIL_FROM, to: profile.email, subject, html });
      await admin
        .from("speeches")
        .update({ follow_up_sent_at: new Date().toISOString() })
        .eq("id", speech.id);
      sent += 1;
    } catch (error) {
      // Leave follow_up_sent_at null so this row is retried next run.
      console.error("Failed to send follow-up email", speech.id, error);
    }
  }

  return NextResponse.json({ checked: speeches.length, sent });
}

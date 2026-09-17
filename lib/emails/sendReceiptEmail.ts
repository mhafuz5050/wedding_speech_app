import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getSpeechType } from "@/lib/speechTypes";
import { PRICING, EMAIL_FROM } from "@/lib/config";
import { createResendClient } from "@/lib/resend/client";
import { receiptEmail } from "./receiptEmail";

function formatAmount(amountPence: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountPence / 100);
}

// Best-effort: called once, right after a payment is durably recorded
// (see app/api/webhooks/stripe/route.ts). A failure here is logged, never
// thrown — the payment itself is already correctly saved either way.
export async function sendReceiptEmail(params: {
  speechId: string;
  userId: string;
  plan: "standard" | "premium";
  amountPence: number;
  currency: string;
}): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("Missing NEXT_PUBLIC_APP_URL — skipping receipt email");
    return;
  }

  const admin = createSupabaseAdminClient();
  const [{ data: speech }, { data: profile }] = await Promise.all([
    admin
      .from("speeches")
      .select("speech_type, answers")
      .eq("id", params.speechId)
      .maybeSingle(),
    admin.from("profiles").select("email").eq("id", params.userId).maybeSingle(),
  ]);

  if (!speech || !profile) {
    console.error("Could not load speech/profile for receipt email", params.speechId);
    return;
  }

  const answers = questionnaireSchema.safeParse(speech.answers);
  const speechType = getSpeechType(speech.speech_type);
  const coupleNames = answers.success
    ? `${answers.data.partnerAName} & ${answers.data.partnerBName}`
    : "the happy couple";

  const { subject, html } = receiptEmail({
    speechTypeLabel: speechType?.label ?? "wedding",
    coupleNames,
    speechUrl: `${appUrl}/speech/${params.speechId}`,
    planLabel: PRICING[params.plan].label,
    amountFormatted: formatAmount(params.amountPence, params.currency),
  });

  try {
    const resend = createResendClient();
    await resend.emails.send({ from: EMAIL_FROM, to: profile.email, subject, html });
  } catch (error) {
    console.error("Failed to send receipt email", error);
  }
}

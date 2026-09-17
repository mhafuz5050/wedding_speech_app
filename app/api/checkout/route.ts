import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createStripeClient } from "@/lib/stripe/client";

const checkoutRequestSchema = z.object({
  speechId: z.string().uuid(),
  plan: z.enum(["standard", "premium"]),
});

function getPriceId(plan: "standard" | "premium"): string | undefined {
  return plan === "standard"
    ? process.env.STRIPE_PRICE_STANDARD
    : process.env.STRIPE_PRICE_PREMIUM;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const origin = new URL(request.url).origin;
  const rawSpeechId = formData.get("speechId");

  const parsed = checkoutRequestSchema.safeParse({
    speechId: rawSpeechId,
    plan: formData.get("plan"),
  });

  if (!parsed.success) {
    const fallback = typeof rawSpeechId === "string" ? rawSpeechId : "";
    return NextResponse.redirect(`${origin}/speech/${fallback}?error=invalid_request`, 303);
  }

  const { speechId, plan } = parsed.data;

  if (formData.get("consent") === null) {
    return NextResponse.redirect(`${origin}/speech/${speechId}?error=consent_required`, 303);
  }

  const admin = createSupabaseAdminClient();
  const { data: speech } = await admin
    .from("speeches")
    .select("id, user_id, status")
    .eq("id", speechId)
    .maybeSingle();

  if (!speech) {
    return NextResponse.json({ error: "Speech not found." }, { status: 404 });
  }

  // Already paid — never create a second charge for the same speech.
  if (speech.status === "paid") {
    return NextResponse.redirect(`${origin}/speech/${speechId}`, 303);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const priceId = getPriceId(plan);

  if (!appUrl || !priceId) {
    console.error("Missing NEXT_PUBLIC_APP_URL or Stripe price id for plan", plan);
    return NextResponse.redirect(`${origin}/speech/${speechId}?error=checkout_unavailable`, 303);
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("email")
    .eq("id", speech.user_id)
    .maybeSingle();

  try {
    const stripe = createStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/speech/${speechId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/speech/${speechId}`,
      customer_email: profile?.email,
      metadata: { speechId, plan, userId: speech.user_id },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Failed to create Stripe checkout session", error);
    return NextResponse.redirect(`${origin}/speech/${speechId}?error=checkout_unavailable`, 303);
  }
}

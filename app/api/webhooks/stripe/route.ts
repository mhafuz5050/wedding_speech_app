import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe/client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendReceiptEmail } from "@/lib/emails/sendReceiptEmail";
import { captureServerEvent } from "@/lib/posthog/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  // Stripe signs the exact raw bytes — never call request.json() first.
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = createStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const speechId = session.metadata?.speechId;
  const plan = session.metadata?.plan;
  const userId = session.metadata?.userId;

  if (!speechId || !userId || (plan !== "standard" && plan !== "premium")) {
    console.error("Checkout session missing expected metadata", session.id);
    return;
  }

  const admin = createSupabaseAdminClient();

  // Idempotency lives here, at the unique constraint on stripe_session_id —
  // not in a check-then-act read, which would leave a race window. A
  // duplicate delivery (Stripe retry, or a manual replay) hits 23505 and
  // is treated as already-handled.
  const { error: insertError } = await admin.from("payments").insert({
    user_id: userId,
    speech_id: speechId,
    stripe_session_id: session.id,
    amount_pence: session.amount_total ?? 0,
    currency: session.currency ?? "gbp",
    status: "paid",
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return;
    }
    console.error("Failed to record payment", insertError);
    return;
  }

  const { error: updateError } = await admin
    .from("speeches")
    .update({ status: "paid", plan, paid_at: new Date().toISOString() })
    .eq("id", speechId);

  if (updateError) {
    console.error("Failed to mark speech as paid", updateError);
    return;
  }

  await sendReceiptEmail({
    speechId,
    userId,
    plan,
    amountPence: session.amount_total ?? 0,
    currency: session.currency ?? "gbp",
  });

  await captureServerEvent(userId, "payment_completed", {
    speechId,
    plan,
    amountPence: session.amount_total ?? 0,
    currency: session.currency ?? "gbp",
  });
}

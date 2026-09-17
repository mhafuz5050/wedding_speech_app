import "server-only";
import Stripe from "stripe";

export function createStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(key);
}

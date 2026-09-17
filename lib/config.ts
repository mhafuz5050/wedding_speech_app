export const APP_NAME = "Toastwise";

// Must match a domain verified in Resend before real sending works —
// see the README's Resend setup section.
export const EMAIL_FROM = "Toastwise <hello@toastwise.app>";

export const PRICING = {
  standard: {
    label: "Standard",
    price: 19,
    currency: "GBP",
    features: [
      "Full speech, written for your details",
      "3 section revisions",
      "PDF download",
    ],
  },
  premium: {
    label: "Premium",
    price: 29,
    currency: "GBP",
    features: [
      "Unlimited revisions for 30 days",
      "2 alternative openings",
      "Printable cue cards",
      "Delivery notes (pauses, timing, where to look up)",
    ],
  },
} as const;

export const APP_NAME = "Toastwise";

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

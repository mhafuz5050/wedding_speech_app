"use client";

import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false,
    persistence: "localStorage+cookie",
  });
}

// Both no-op safely (never throw) if PostHog hasn't been initialized —
// i.e. before cookie consent, or if NEXT_PUBLIC_POSTHOG_KEY is unset.
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.capture(event, properties);
}

export function identifyUser(email: string) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.identify(email);
}

"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/posthog/client";
import { CookieBanner } from "./CookieBanner";

export function PostHogInit() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem("cookie_consent") === "accepted") {
        initPostHog();
      }
    } catch {
      // localStorage unavailable — just skip auto-init; the banner (if
      // shown) still offers Accept.
    }
  }, []);

  return <CookieBanner />;
}

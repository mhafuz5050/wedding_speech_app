"use client";

import { useState, useSyncExternalStore } from "react";
import { initPostHog } from "@/lib/posthog/client";

const STORAGE_KEY = "cookie_consent";

function subscribe() {
  // Consent is only ever written by this component's own handlers, which
  // re-render synchronously via setDismissed — no external change to
  // subscribe to.
  return () => {};
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function CookieBanner() {
  const storedConsent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  const visible = !dismissed && storedConsent !== "accepted" && storedConsent !== "rejected";

  function handleAccept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Ignore — the banner will just reappear next visit, harmless.
    }
    initPostHog();
    setDismissed(true);
  }

  function handleReject() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "rejected");
    } catch {
      // Ignore.
    }
    setDismissed(true);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white px-4 py-4 shadow-lg">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-700">
          We use analytics cookies to understand how the site is used. See our{" "}
          <a href="/privacy" className="text-rose-600 underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

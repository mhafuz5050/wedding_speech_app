"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 1500;

interface PaymentConfirmingProps {
  speechId: string;
}

export function PaymentConfirming({ speechId }: PaymentConfirmingProps) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch(`/api/speeches/${speechId}/status`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!cancelled && data.status === "paid") {
          router.push(`/speech/${speechId}`);
          return;
        }
      } catch {
        // Ignore a transient network error and try again on the next tick.
      }

      if (!cancelled) {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    let timer = setTimeout(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [speechId, router]);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center">
      <div
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600"
      />
      <div>
        <h1 className="text-lg font-bold text-zinc-900">Confirming your payment…</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This usually takes a few seconds. This page will update automatically.
        </p>
      </div>
    </div>
  );
}

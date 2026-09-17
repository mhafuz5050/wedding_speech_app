"use client";

import { useState } from "react";

interface PremiumExtrasProps {
  speechId: string;
  initialAltOpenings: [string, string] | null;
  initialDeliveryNotes: string | null;
}

export function PremiumExtras({
  speechId,
  initialAltOpenings,
  initialDeliveryNotes,
}: PremiumExtrasProps) {
  const [altOpenings, setAltOpenings] = useState(initialAltOpenings);
  const [deliveryNotes, setDeliveryNotes] = useState(initialDeliveryNotes);
  const [loadingOpenings, setLoadingOpenings] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateOpenings() {
    setLoadingOpenings(true);
    setError(null);
    try {
      const response = await fetch(`/api/speeches/${speechId}/alt-openings`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setAltOpenings(data.openings);
    } catch {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoadingOpenings(false);
    }
  }

  async function handleGenerateNotes() {
    setLoadingNotes(true);
    setError(null);
    try {
      const response = await fetch(`/api/speeches/${speechId}/delivery-notes`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDeliveryNotes(data.notes);
    } catch {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoadingNotes(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">
      <h2 className="text-base font-bold text-zinc-900">Premium extras</h2>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div>
        <h3 className="text-sm font-semibold text-zinc-800">Alternative openings</h3>
        {altOpenings ? (
          <div className="mt-2 flex flex-col gap-2">
            {altOpenings.map((opening, index) => (
              <p key={index} className="rounded-xl bg-white p-3 text-sm text-zinc-800">
                {opening}
              </p>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGenerateOpenings}
            disabled={loadingOpenings}
            className="mt-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
          >
            {loadingOpenings ? "Generating…" : "Generate alternative openings"}
          </button>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-800">Delivery notes</h3>
        {deliveryNotes ? (
          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-white p-3 text-sm text-zinc-800">
            {deliveryNotes}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleGenerateNotes}
            disabled={loadingNotes}
            className="mt-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
          >
            {loadingNotes ? "Generating…" : "Generate delivery notes"}
          </button>
        )}
      </div>
    </div>
  );
}

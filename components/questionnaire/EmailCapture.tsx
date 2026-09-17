"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email();

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function EmailCapture({ onSubmit, onBack, isSubmitting }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    onSubmit(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
          Where should we send your speech?
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          We&apos;ll create your account in the background — no password
          needed right now.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-800">
          Email address
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-xl border border-zinc-300 px-5 py-3 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Writing your speech…" : "Get my speech"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

const initialState: WaitlistResult | null = null;

export function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialState,
  );

  if (state?.ok) {
    return (
      <p
        role="status"
        className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
      >
        {state.alreadyJoined
          ? "You're already on the list — we'll be in touch."
          : "You're on the list! We'll email you the moment we launch."}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {state?.ok === false && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { requestMagicLink, type MagicLinkResult } from "@/app/account/actions";

const initialState: MagicLinkResult | null = null;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(requestMagicLink, initialState);

  if (state?.ok) {
    return (
      <p
        role="status"
        className="w-full max-w-sm rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
      >
        Check your email for a link to sign in.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-2">
      <label htmlFor="email" className="text-sm font-medium text-zinc-800">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
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
          {isPending ? "Sending…" : "Send magic link"}
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

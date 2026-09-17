"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Something went wrong</h1>
      <p className="max-w-sm text-sm text-zinc-600">
        Sorry about that — it&apos;s not you, it&apos;s us. Try again, and if
        it keeps happening, please get in touch.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700"
      >
        Try again
      </button>
    </main>
  );
}

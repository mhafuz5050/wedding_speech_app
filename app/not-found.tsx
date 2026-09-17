import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Page not found</h1>
      <p className="max-w-sm text-sm text-zinc-600">
        We couldn&apos;t find what you were looking for. It may have been
        moved, or the link might not be quite right.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700"
      >
        Back to home
      </Link>
    </main>
  );
}

export function PageLoading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600"
      />
      <span className="sr-only">Loading…</span>
    </main>
  );
}

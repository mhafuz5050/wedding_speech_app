export default function UnsubscribedPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">You&apos;re unsubscribed</h1>
      <p className="max-w-sm text-sm text-zinc-600">
        You won&apos;t receive any more marketing emails from us. You&apos;ll still
        get a receipt if you make a purchase.
      </p>
    </main>
  );
}

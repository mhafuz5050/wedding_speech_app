import { APP_NAME } from "@/lib/config";
import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-12 pt-16 text-center sm:pt-24">
      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
        {APP_NAME}
      </span>
      <h1 className="max-w-md text-3xl font-bold leading-tight text-zinc-900 sm:max-w-xl sm:text-5xl">
        Write a wedding speech you&apos;ll be proud to give
      </h1>
      <p className="max-w-md text-lg text-zinc-600 sm:max-w-lg">
        Answer a few questions about the couple and get a polished, personal
        speech in minutes — the right length, the right tone, ready to
        deliver.
      </p>
      <WaitlistForm />
      <p className="text-sm text-zinc-500">
        No spam. We&apos;ll only email you when we launch.
      </p>
    </section>
  );
}

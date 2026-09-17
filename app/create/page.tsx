import Link from "next/link";
import { SPEECH_TYPES } from "@/lib/speechTypes";

export default function CreatePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-8 px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          What speech are you giving?
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          We&apos;ll ask the right questions for your role.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        {SPEECH_TYPES.map((type) => (
          <Link
            key={type.slug}
            href={`/create/${type.slug}`}
            className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-rose-400 hover:bg-rose-50"
          >
            <span className="text-lg font-semibold text-zinc-900">
              {type.label}
            </span>
            <span className="text-sm text-zinc-600">{type.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SPEECH_GUIDES, getSpeechGuide } from "@/lib/speechGuides";
import { getSpeechType } from "@/lib/speechTypes";
import { targetWordCount } from "@/lib/ai/buildUserMessage";
import { APP_NAME } from "@/lib/config";

const LENGTHS: Array<"3" | "5" | "7"> = ["3", "5", "7"];

export function generateStaticParams() {
  return SPEECH_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getSpeechGuide(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} — ${APP_NAME}`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function SpeechGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSpeechGuide(slug);

  if (!guide) {
    notFound();
  }

  const speechType = getSpeechType(guide.speechTypeSlug);
  const otherGuides = SPEECH_GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-16">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          {APP_NAME} guide
        </span>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{guide.title}</h1>
        <p className="text-base text-zinc-600">{guide.intro}</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-zinc-900">Structure</h2>
        <ol className="flex flex-col gap-3">
          {guide.structure.map((step, index) => (
            <li
              key={step.heading}
              className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-zinc-900">{step.heading}</p>
                <p className="text-sm text-zinc-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-zinc-900">How long should it be?</h2>
        <p className="text-sm text-zinc-600">
          Aim for about 130 spoken words per minute at a natural, unhurried pace:
        </p>
        <div className="grid grid-cols-3 gap-3">
          {LENGTHS.map((length) => (
            <div
              key={length}
              className="rounded-2xl border border-zinc-200 bg-white p-4 text-center"
            >
              <p className="text-xl font-bold text-zinc-900">{length} min</p>
              <p className="text-xs text-zinc-500">~{targetWordCount(length)} words</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-zinc-900">Mistakes to avoid</h2>
        <ul className="flex flex-col gap-2">
          {guide.mistakes.map((mistake) => (
            <li key={mistake} className="flex gap-2 text-sm text-zinc-700">
              <span aria-hidden className="text-rose-600">
                ✗
              </span>
              {mistake}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-zinc-900">Example lines</h2>
        <div className="flex flex-col gap-3">
          {guide.exampleLines.map((line) => (
            <blockquote
              key={line}
              className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm italic text-zinc-700"
            >
              {line}
            </blockquote>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <h2 className="text-lg font-bold text-zinc-900">
          Ready to write your {speechType?.label ?? "wedding"} speech?
        </h2>
        <p className="text-sm text-zinc-600">
          Answer a few questions about the couple and get a first draft in minutes.
        </p>
        <Link
          href={`/create/${guide.speechTypeSlug}`}
          className="rounded-xl bg-rose-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Start my speech
        </Link>
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6">
        <h2 className="text-sm font-semibold text-zinc-500">Other guides</h2>
        <ul className="flex flex-col gap-1">
          {otherGuides.map((other) => (
            <li key={other.slug}>
              <Link href={`/speeches/${other.slug}`} className="text-sm text-rose-600 underline">
                {other.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

import { notFound } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { speechSectionSchema } from "@/lib/ai/generateSpeech";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getSpeechType } from "@/lib/speechTypes";
import { buildPreview, totalWordCount } from "@/lib/speechPreview";
import { SpeechSectionView } from "@/components/speech/SpeechSectionView";
import { PaywallPanel } from "@/components/speech/PaywallPanel";

const sectionsSchema = z.array(speechSectionSchema);

export default async function SpeechPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select("speech_type, answers, sections, status")
    .eq("id", id)
    .maybeSingle();

  if (!speech) {
    notFound();
  }

  const sections = sectionsSchema.parse(speech.sections);
  const answers = questionnaireSchema.parse(speech.answers);
  const speechType = getSpeechType(speech.speech_type);
  const isPaid = speech.status === "paid";

  // Only status === "paid" (set exclusively by the verified Stripe webhook
  // in a later milestone) ever sees the full text — CLAUDE.md §7.
  const viewSections = isPaid
    ? sections.map((section) => ({ ...section, revealed: true as const }))
    : buildPreview(sections);

  const minutes = Math.round(totalWordCount(sections) / 130);

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-10">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          {speechType?.label ?? "Wedding"} speech
        </p>
        <h1 className="mt-2 text-xl font-bold text-zinc-900 sm:text-2xl">
          For {answers.partnerAName} &amp; {answers.partnerBName}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          About {minutes} minute{minutes === 1 ? "" : "s"} at a natural pace.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-4">
        {viewSections.map((section) => (
          <SpeechSectionView
            key={section.id}
            title={section.title}
            content={section.content}
            revealed={section.revealed}
          />
        ))}
      </div>

      {!isPaid && <PaywallPanel />}
    </main>
  );
}

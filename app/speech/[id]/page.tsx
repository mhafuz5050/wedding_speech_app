import { notFound } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { speechSectionSchema } from "@/lib/ai/generateSpeech";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getSpeechType } from "@/lib/speechTypes";
import { buildPreview, totalWordCount } from "@/lib/speechPreview";
import { canRevise } from "@/lib/revisionLimits";
import { SpeechSectionView } from "@/components/speech/SpeechSectionView";
import { PaywallPanel } from "@/components/speech/PaywallPanel";
import { UnlockedSpeech } from "@/components/speech/UnlockedSpeech";
import { TrackEvent } from "@/components/analytics/TrackEvent";

const sectionsSchema = z.array(speechSectionSchema);
const altOpeningsSchema = z.tuple([z.string(), z.string()]).nullable();

const CHECKOUT_ERROR_MESSAGES: Record<string, string> = {
  invalid_request: "Something went wrong with that request. Please try again.",
  consent_required: "Please agree to the consent checkbox before continuing to payment.",
  checkout_unavailable: "Payment isn't available right now. Please try again shortly.",
};

export default async function SpeechPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select(
      "speech_type, answers, sections, status, plan, revisions_used, paid_at, alt_openings, delivery_notes",
    )
    .eq("id", id)
    .maybeSingle();

  if (!speech) {
    notFound();
  }

  const sections = sectionsSchema.parse(speech.sections);
  const answers = questionnaireSchema.parse(speech.answers);
  const speechType = getSpeechType(speech.speech_type);
  const isPaid = speech.status === "paid";
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

      {isPaid ? (
        <UnlockedSpeech
          speechId={id}
          plan={speech.plan === "premium" ? "premium" : "standard"}
          initialSections={sections}
          initialRevisionsUsed={speech.revisions_used}
          revisionCheck={canRevise({
            plan: speech.plan,
            revisions_used: speech.revisions_used,
            paid_at: speech.paid_at,
          })}
          initialAltOpenings={altOpeningsSchema.parse(speech.alt_openings)}
          initialDeliveryNotes={speech.delivery_notes}
        />
      ) : (
        <>
          <TrackEvent event="paywall_viewed" properties={{ speechId: id }} />
          <div className="flex w-full max-w-md flex-col gap-4">
            {buildPreview(sections).map((section) => (
              <SpeechSectionView
                key={section.id}
                title={section.title}
                content={section.content}
                revealed={section.revealed}
              />
            ))}
          </div>

          {error && CHECKOUT_ERROR_MESSAGES[error] && (
            <p
              role="alert"
              className="w-full max-w-md rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {CHECKOUT_ERROR_MESSAGES[error]}
            </p>
          )}

          <PaywallPanel speechId={id} />
        </>
      )}
    </main>
  );
}

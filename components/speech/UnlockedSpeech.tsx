"use client";

import { useState } from "react";
import { EditableSection } from "./EditableSection";
import { PremiumExtras } from "./PremiumExtras";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface UnlockedSpeechProps {
  speechId: string;
  plan: "standard" | "premium";
  initialSections: Section[];
  initialRevisionsUsed: number;
  revisionCheck: { allowed: true } | { allowed: false; reason: string };
  initialAltOpenings: [string, string] | null;
  initialDeliveryNotes: string | null;
}

export function UnlockedSpeech({
  speechId,
  plan,
  initialSections,
  initialRevisionsUsed,
  revisionCheck,
  initialAltOpenings,
  initialDeliveryNotes,
}: UnlockedSpeechProps) {
  const [sections, setSections] = useState(initialSections);
  const [revisionsUsed, setRevisionsUsed] = useState(initialRevisionsUsed);
  const [canStillRevise, setCanStillRevise] = useState(revisionCheck.allowed);
  const [blockedReason, setBlockedReason] = useState<string | null>(
    revisionCheck.allowed ? null : revisionCheck.reason,
  );

  function handleSectionSaved(sectionId: string, content: string) {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, content } : section)),
    );
  }

  function handleSectionRewritten(
    sectionId: string,
    content: string,
    newRevisionsUsed: number,
  ) {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, content } : section)),
    );
    setRevisionsUsed(newRevisionsUsed);
    if (plan === "standard" && newRevisionsUsed >= 3) {
      setCanStillRevise(false);
      setBlockedReason(
        "You've used all 3 revisions included with Standard. Upgrade to Premium for unlimited revisions.",
      );
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {plan === "standard" && (
        <p className="text-sm text-zinc-600">
          {Math.max(0, 3 - revisionsUsed)} of 3 AI rewrites remaining.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <EditableSection
            key={section.id}
            speechId={speechId}
            sectionId={section.id}
            title={section.title}
            content={section.content}
            canRewrite={canStillRevise}
            blockedReason={blockedReason}
            onSaved={(content) => handleSectionSaved(section.id, content)}
            onRewritten={(content, newRevisionsUsed) =>
              handleSectionRewritten(section.id, content, newRevisionsUsed)
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={`/api/speeches/${speechId}/pdf`}
          className="rounded-xl bg-rose-600 px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Download PDF
        </a>
        {plan === "premium" && (
          <a
            href={`/api/speeches/${speechId}/cue-cards`}
            className="rounded-xl border border-rose-300 px-5 py-3 text-center text-base font-semibold text-rose-700 transition-colors hover:bg-rose-50"
          >
            Download cue cards
          </a>
        )}
      </div>

      {plan === "premium" && (
        <PremiumExtras
          speechId={speechId}
          initialAltOpenings={initialAltOpenings}
          initialDeliveryNotes={initialDeliveryNotes}
        />
      )}
    </div>
  );
}

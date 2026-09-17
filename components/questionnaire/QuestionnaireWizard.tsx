"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONNAIRE_STEPS } from "./steps";
import { QuestionStep } from "./QuestionStep";
import { ProgressBar } from "./ProgressBar";
import { Summary } from "./Summary";
import { EmailCapture } from "./EmailCapture";
import type { QuestionnaireAnswers } from "@/lib/schemas/questionnaire";
import type { SpeechTypeSlug } from "@/lib/speechTypes";

interface QuestionnaireWizardProps {
  typeSlug: SpeechTypeSlug;
  typeLabel: string;
}

type Stage = "questions" | "summary" | "email" | "generating" | "error";

export function QuestionnaireWizard({ typeSlug, typeLabel }: QuestionnaireWizardProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [stage, setStage] = useState<Stage>("questions");
  const [errorMessage, setErrorMessage] = useState("");

  const totalSteps = QUESTIONNAIRE_STEPS.length;
  const currentStep = QUESTIONNAIRE_STEPS[stepIndex];

  function handleNext(values: Partial<QuestionnaireAnswers>) {
    const updated = { ...answers, ...values };
    setAnswers(updated);
    if (stepIndex + 1 < totalSteps) {
      setStepIndex((i) => i + 1);
    } else {
      setStage("summary");
    }
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function handleEdit() {
    setStage("questions");
    setStepIndex(0);
  }

  async function handleEmailSubmit(email: string) {
    setStage("generating");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speechType: typeSlug, answers, email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setStage("error");
        return;
      }

      router.push(`/speech/${data.speechId}`);
    } catch {
      setErrorMessage("Something went wrong. Please check your connection and try again.");
      setStage("error");
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-8 px-4 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Writing a {typeLabel} speech
        </p>
        {stage === "questions" && (
          <div className="mt-3">
            <ProgressBar current={stepIndex + 1} total={totalSteps} />
          </div>
        )}
      </div>

      {stage === "questions" && (
        <QuestionStep
          key={currentStep.title}
          step={currentStep}
          values={answers}
          onNext={handleNext}
          onBack={stepIndex > 0 ? handleBack : undefined}
        />
      )}

      {stage === "summary" && (
        <Summary
          answers={answers}
          onEdit={handleEdit}
          onContinue={() => setStage("email")}
        />
      )}

      {(stage === "email" || stage === "generating") && (
        <EmailCapture
          onSubmit={handleEmailSubmit}
          onBack={() => setStage("summary")}
          isSubmitting={stage === "generating"}
        />
      )}

      {stage === "error" && (
        <div className="flex w-full max-w-md flex-col gap-4">
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => setStage("email")}
            className="rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

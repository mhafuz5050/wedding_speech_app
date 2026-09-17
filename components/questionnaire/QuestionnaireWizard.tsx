"use client";

import { useState } from "react";
import { QUESTIONNAIRE_STEPS } from "./steps";
import { QuestionStep } from "./QuestionStep";
import { ProgressBar } from "./ProgressBar";
import { Summary } from "./Summary";
import type { QuestionnaireAnswers } from "@/lib/schemas/questionnaire";

interface QuestionnaireWizardProps {
  typeLabel: string;
}

export function QuestionnaireWizard({ typeLabel }: QuestionnaireWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = QUESTIONNAIRE_STEPS.length;
  const currentStep = QUESTIONNAIRE_STEPS[stepIndex];

  function handleNext(values: Partial<QuestionnaireAnswers>) {
    const updated = { ...answers, ...values };
    setAnswers(updated);
    if (stepIndex + 1 < totalSteps) {
      setStepIndex((i) => i + 1);
    } else {
      setIsComplete(true);
    }
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function handleEdit() {
    setIsComplete(false);
    setStepIndex(0);
  }

  return (
    <div className="flex w-full flex-col items-center gap-8 px-4 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Writing a {typeLabel} speech
        </p>
        {!isComplete && (
          <div className="mt-3">
            <ProgressBar current={stepIndex + 1} total={totalSteps} />
          </div>
        )}
      </div>

      {isComplete ? (
        <Summary answers={answers} onEdit={handleEdit} />
      ) : (
        <QuestionStep
          key={currentStep.title}
          step={currentStep}
          values={answers}
          onNext={handleNext}
          onBack={stepIndex > 0 ? handleBack : undefined}
        />
      )}
    </div>
  );
}

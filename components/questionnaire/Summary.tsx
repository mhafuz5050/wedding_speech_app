import { QUESTIONNAIRE_STEPS } from "./steps";
import type { QuestionnaireAnswers } from "@/lib/schemas/questionnaire";

interface SummaryProps {
  answers: Partial<QuestionnaireAnswers>;
  onEdit: () => void;
  onContinue: () => void;
}

export function Summary({ answers, onEdit, onContinue }: SummaryProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
          Here&apos;s what we&apos;ve got
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Check everything looks right. You can edit any answer before we
          write your speech.
        </p>
      </div>

      <dl className="flex flex-col gap-4">
        {QUESTIONNAIRE_STEPS.flatMap((step) => step.fields).map((field) => {
          const rawValue = answers[field.id];
          const displayValue = field.options
            ? (field.options.find((option) => option.value === rawValue)
                ?.label ?? "—")
            : rawValue && rawValue.length > 0
              ? rawValue
              : "—";

          return (
            <div
              key={field.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {field.label}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">
                {displayValue}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl border border-zinc-300 px-5 py-3 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          Edit answers
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Get my speech
        </button>
      </div>
    </div>
  );
}

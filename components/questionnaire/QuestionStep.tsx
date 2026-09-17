"use client";

import { useState, type FormEvent } from "react";
import type { QuestionStepDef } from "./steps";
import {
  questionnaireFieldSchemas,
  type QuestionnaireAnswers,
  type QuestionnaireFieldId,
} from "@/lib/schemas/questionnaire";

interface QuestionStepProps {
  step: QuestionStepDef;
  values: Partial<QuestionnaireAnswers>;
  onNext: (values: Partial<QuestionnaireAnswers>) => void;
  onBack?: () => void;
}

type Draft = Partial<Record<QuestionnaireFieldId, string>>;

export function QuestionStep({ step, values, onNext, onBack }: QuestionStepProps) {
  const [draft, setDraft] = useState<Draft>(() => {
    const initial: Draft = {};
    for (const field of step.fields) {
      initial[field.id] =
        values[field.id] ?? (field.id === "englishVariant" ? "uk" : "");
    }
    return initial;
  });
  const [errors, setErrors] = useState<Draft>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Draft = {};
    const parsedValues: Record<string, unknown> = {};

    for (const field of step.fields) {
      const schema = questionnaireFieldSchemas[field.id];
      const result = schema.safeParse(draft[field.id]);
      if (!result.success) {
        nextErrors[field.id] =
          result.error.issues[0]?.message ?? "This doesn't look right.";
      } else {
        parsedValues[field.id] = result.data;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onNext(parsedValues as Partial<QuestionnaireAnswers>);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
          {step.title}
        </h2>
        {step.helper && (
          <p className="mt-2 text-sm text-zinc-600">{step.helper}</p>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {step.fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-2">
            <label
              htmlFor={field.id}
              className="text-sm font-medium text-zinc-800"
            >
              {field.label}
              {field.required === false && (
                <span className="ml-1 font-normal text-zinc-400">
                  (optional)
                </span>
              )}
            </label>

            {field.kind === "text" && (
              <input
                id={field.id}
                value={draft[field.id] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [field.id]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            )}

            {field.kind === "textarea" && (
              <textarea
                id={field.id}
                value={draft[field.id] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [field.id]: e.target.value }))
                }
                placeholder={field.placeholder}
                rows={4}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            )}

            {field.kind === "radio" && field.options && (
              <div className="flex flex-col gap-2">
                {field.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base transition-colors ${
                      draft[field.id] === option.value
                        ? "border-rose-500 bg-rose-50 text-rose-900"
                        : "border-zinc-300 bg-white text-zinc-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={option.value}
                      checked={draft[field.id] === option.value}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          [field.id]: e.target.value,
                        }))
                      }
                      className="h-4 w-4 accent-rose-600"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}

            {errors[field.id] && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-zinc-300 px-5 py-3 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Next
        </button>
      </div>
    </form>
  );
}

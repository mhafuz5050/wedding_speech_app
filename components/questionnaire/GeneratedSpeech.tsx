interface SpeechSectionView {
  id: string;
  title: string;
  content: string;
}

interface GeneratedSpeechProps {
  sections: SpeechSectionView[];
  onStartOver: () => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function GeneratedSpeech({ sections, onStartOver }: GeneratedSpeechProps) {
  const totalWords = sections.reduce(
    (sum, section) => sum + countWords(section.content),
    0,
  );
  const estimatedMinutes = Math.round(totalWords / 130);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
          Your speech is ready
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          {totalWords} words — about {estimatedMinutes} minute
          {estimatedMinutes === 1 ? "" : "s"} at a natural pace.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              {section.title}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-base text-zinc-800">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStartOver}
        className="rounded-xl border border-zinc-300 px-5 py-3 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
      >
        Start over
      </button>
    </div>
  );
}

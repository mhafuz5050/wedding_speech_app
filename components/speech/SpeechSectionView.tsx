interface SpeechSectionViewProps {
  title: string;
  content: string;
  revealed: boolean;
}

const PLACEHOLDER_BAR_WIDTHS = ["w-full", "w-11/12", "w-5/6", "w-3/4", "w-2/3"];

export function SpeechSectionView({ title, content, revealed }: SpeechSectionViewProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-600">
        {title}
      </h3>

      {revealed ? (
        <p className="mt-2 whitespace-pre-wrap text-base text-zinc-800">{content}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2" aria-hidden="true">
          {PLACEHOLDER_BAR_WIDTHS.map((width, index) => (
            <div key={index} className={`h-3 ${width} rounded-full bg-zinc-200`} />
          ))}
          <p className="mt-2 text-xs font-medium text-zinc-400">
            🔒 Unlock to read this section
          </p>
        </div>
      )}
    </div>
  );
}

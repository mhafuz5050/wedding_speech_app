const steps = [
  {
    title: "Answer a few questions",
    description:
      "Tell us who you are, your favourite stories about the couple, and the tone you want — funny, heartfelt, or balanced.",
  },
  {
    title: "Get your speech",
    description:
      "We turn your answers into a full speech, structured and timed to how long you want to speak for.",
  },
  {
    title: "Edit, and deliver",
    description:
      "Tweak any section, download a PDF or cue cards, and walk up knowing exactly what you're going to say.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16">
      <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
        How it works
      </h2>
      <ol className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-zinc-900">
              {step.title}
            </h3>
            <p className="text-sm text-zinc-600">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

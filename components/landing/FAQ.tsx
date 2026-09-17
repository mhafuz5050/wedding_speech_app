const faqs = [
  {
    question: "I'm not a writer — will this actually sound like me?",
    answer:
      "You just answer questions about your real memories and stories. We turn those into a properly structured speech — nothing is invented, so it stays true to what you told us.",
  },
  {
    question: "How long does it take?",
    answer:
      "A few minutes to answer the questions, then your speech is ready right away.",
  },
  {
    question: "Can I edit it afterwards?",
    answer:
      "Yes. You can edit any section yourself or ask us to rewrite a section with different instructions, like \"make it funnier\".",
  },
  {
    question: "What if I'm not happy with it?",
    answer:
      "We offer a 14-day money-back guarantee, no questions asked.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16">
      <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
        Frequently asked questions
      </h2>
      <div className="mt-8 flex flex-col gap-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-zinc-200 bg-white p-4 open:pb-4"
          >
            <summary className="cursor-pointer list-none text-base font-medium text-zinc-900 marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span
                  aria-hidden
                  className="shrink-0 text-zinc-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

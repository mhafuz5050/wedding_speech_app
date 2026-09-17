import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-2 px-4 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{title}</h1>
      <p className="text-xs text-zinc-500">Last updated: {lastUpdated}</p>
      <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-zinc-700 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_strong]:font-semibold [&_strong]:text-rose-700">
        {children}
      </div>
    </main>
  );
}
